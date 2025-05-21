import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { Public } from 'src/infra/auth/public';
import { AuthenticateUserDto } from 'src/services/users/dto/authenticate-user-dto';
import { UsersService } from 'src/services/users/users.service';

@Controller('/auth')
export class AuthenticateUserController {
  constructor(private usersService: UsersService) {}

  @Post('/login')
  @HttpCode(200)
  @Public()
  async authenticateUser(@Body() dto: AuthenticateUserDto) {
    const result = await this.usersService.authenticateUser(dto);

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    const { accessToken: access_token } = result.value;

    return {
      access_token,
    };
  }
}
