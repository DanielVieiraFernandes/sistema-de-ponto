import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { CreateUserDto } from '@/services/users/dto/create-user-dto';
import { UsersService } from '@/services/users/users.service';
import { Response } from 'express';
import { EnvService } from '@/infra/env/env.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthenticateUserResponseDto } from './response-dto/authenticate-user-response-dto';

@Controller('/users')
export class RegisterUserController {
  constructor(
    private usersService: UsersService,
    private env: EnvService,
  ) {}

  @Post('/register')
  @Public()
  @ApiResponse({
    status: 201,
    type: AuthenticateUserResponseDto,
  })
  async registerUser(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.usersService.registerUser(dto);

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    const { accessToken: access_token, refreshToken: refresh_token } =
      result.value;

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: this.env.get('NODE_ENV') === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
