import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { AuthenticateUserDto } from '@/services/users/dto/authenticate-user-dto';
import { UsersService } from '@/services/users/users.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthenticateUserResponseDto } from './response-dto/authenticate-user-response-dto';
import { Response } from 'express';
import { EnvService } from '@/infra/env/env.service';
@Controller('/auth')
export class AuthenticateUserController {
  constructor(
    private usersService: UsersService,
    private env: EnvService,
  ) {}

  @Post('/login')
  @Public()
  @ApiResponse({
    status: 201,
    type: AuthenticateUserResponseDto,
  })
  async authenticateUser(
    @Body() dto: AuthenticateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.usersService.authenticateUser(dto);

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
