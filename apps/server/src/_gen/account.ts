// @ts-nocheck

import {ApiProperty} from '@nestjs/swagger';



export class Account {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  password: string;
}
