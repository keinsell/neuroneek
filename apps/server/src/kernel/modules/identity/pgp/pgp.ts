import {
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { JwtAuthorizationGuard } from '../../../../modules/authentication/guards/jwt-authorization-guard.js';

class CreatePgpKey {
  @ApiProperty({
                 description: "Public key",
               }
  )
  readonly publicKey: string
}

@Controller("/pgp")
export class PgpController {


  @Post()
  @UseGuards(JwtAuthorizationGuard)
  addKey() {
    // Check if the key already exists (User can only have one key)

    // Check if the key is valid

    // Add the key to the database

    // Return the key


    return "Add key";
  }

  @Get()
  @UseGuards(JwtAuthorizationGuard)
  getKeys(
  )
  {
    return "Get key";
  }

}
