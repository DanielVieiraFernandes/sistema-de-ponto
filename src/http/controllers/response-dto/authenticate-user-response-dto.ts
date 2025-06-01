import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateUserResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
