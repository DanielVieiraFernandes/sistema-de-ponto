import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { CreateUserDto } from '@/services/users/dto/create-user-dto';
import { UsersService } from '@/services/users/users.service';

@Controller('/users')
export class RegisterUserController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  @Public()
  async registerUser(@Body() dto: CreateUserDto) {
    const result = await this.usersService.registerUser(dto);

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
