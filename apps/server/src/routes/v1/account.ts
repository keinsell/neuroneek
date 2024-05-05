import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger"
import { hash } from "@node-rs/argon2"
import { nanoid } from "nanoid"
import { Account } from "../../_gen/account"
import { PrismaService } from "../../core/modules/database/prisma/services/prisma-service"
import { GetUser } from '../../core/identity/authn/jwt-authentication-strategy';
import { JwtAuthorizationGuard } from '../../core/identity/authn/components/guards/jwt-authorization-guard';


export class AccountUsernameTaken
  extends BadRequestException {
  constructor() {
    super('Username already exists');
  }
}


export class AccountRegistered {
  id: string = nanoid();
  name: string = "account.registered";

  accountId: string;
  accountUsername: string;


  constructor(accountId: string, username: string) {
    this.accountId = accountId;
    this.accountUsername = username;
  }


  get description() {
    return `Account '${this.accountId}' with username '${this.accountUsername}' was registered successfully!`;
  }
}

export class AccountDeleted {
  id: string = nanoid();
  name: string = "account.deleted";
  description: string;

  constructor(accountId: string) {
    this.description = `Account '${accountId}' was deleted successfully!`;
  }
}


export class RegisterAccount {
  @ApiProperty({ example: "elon_musk", description: "The user's unique username" }) username!: string;
  @ApiProperty({ example: "ISendCarsIntoFuckingSpace", description: "The user's password" }) password!: string;
}

@ApiTags("Account Management")
@Controller('account')
export class AccountController {
  private logger: Logger = new Logger("account.controller")


  constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }


  @ApiOperation({
    summary: 'Register account',
    description: `Operation will register a new account in application allowing user to interact with his namespace.`,
  }) @Post('register') @HttpCode(HttpStatus.OK)
  async register(@Body() body: RegisterAccount): Promise<Account> {
    if (!body?.password || !body?.username) {
      throw new BadRequestException('Username and password are required');
    }

    // Find account with given username and throw error if it exists
    const account = await this.prismaService.account.findUnique({
      where: {
        username: body.username,
      },
    });

    if (account) {
      throw new AccountUsernameTaken();
    }

    // Hash the password and store the user into the database
    const hashPassword = await hash(body.password);

    const user = await this.prismaService.account.create({
      data: {
        username: body.username,
        password: hashPassword,
      },
    });

    const accountRegistered = new AccountRegistered(user.id, user.username)

    this.logger.log(accountRegistered.description)

    return {
      ...user,
    };
  }

  @UseGuards(JwtAuthorizationGuard)
  @ApiOperation({
    summary: "Delete account",
    description: `Operation will delete account from the system. This operation is irreversible.`
  }) @Post('delete') @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async deleteAccount(@Body() body: { accountId?: string }, @GetUser() user: Account) {
    let accountId = body.accountId;

    if (body.accountId) {
      if (user.id !== body.accountId) {
        throw new BadRequestException('You can only delete your own account');
      }
    } else {
      accountId = user.id;
    }

    await this.prismaService.account.delete({
      where: {
        id: accountId,
      },
    });

    const accountDeleted = new AccountDeleted(accountId!)

    this.logger.log(accountDeleted.description)

    return accountDeleted;
  }
}
