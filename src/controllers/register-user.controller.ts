import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/infra/auth/public';
import { CreateUserDto } from 'src/services/users/dto/create-user-dto';
import { UsersService } from 'src/services/users/users.service';

@Controller('users')
export class RegisterUserController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  @Public()
  async registerUser(@Body() dto: CreateUserDto) {
    const result = await this.usersService.registerUser(dto);

    const { accessToken: access_token } = result;

    return {
      access_token,
    };
  }
}
