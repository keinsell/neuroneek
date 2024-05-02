import {
	BadRequestException, Body, Controller, HttpCode, HttpStatus, NotFoundException, Post, Req, UseGuards,
}                      from '@nestjs/common';
import {JwtService}    from '@nestjs/jwt';
import {AuthGuard}     from '@nestjs/passport';
import {Request}       from 'express';
import * as upash      from 'upash';
import {Account}       from "../../_gen/account"
import {PrismaService} from "../../core/modules/database/prisma/services/prisma-service"



@Controller('auth')
export class AuthController {
	constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}


	@Post('register') @HttpCode(HttpStatus.OK)
	async register(@Body() body: { username: string, password: string }): Promise<Account> {
		if (body!.password || body!.username) {
			throw new BadRequestException('Username and password are required');
		}

		// Hash the password and store the user into the database
		const hashPassword = await upash.use('argon2').hash(body.password);
		const user         = await this.prismaService.account.create({
			data: {
				username: body.username,
				password: hashPassword,
			},
		});

		const payload = {
			username: user.username,
			sub:      user.id,
		};

		return {
			id:       user.id,
			username: user.username,
			password: user.password,
		}
	}


	@Post('basic') @HttpCode(HttpStatus.OK) @UseGuards(AuthGuard('basic'))
	async basic(@Req() req: Request) {
		const user: { username: string, password: string } = req.user as any;

		if (!user) {
			throw new NotFoundException();
		}

		const payload = {
			username: user,
			sub:      user.username,
		};

		const accessToken = this.jwtService.sign(payload);

		return {accessToken};
	}
}