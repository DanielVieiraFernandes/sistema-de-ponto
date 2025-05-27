import { UsersService } from '@/services/users/users.service';
import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
export class RefreshTokenController {
  constructor(private usersService: UsersService) {}

  @Post('/refresh-token')
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];

    const result = await this.usersService.generateNewTokens(refreshToken);

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    const { accessToken: access_token, refreshToken: refresh_token } =
      result.value;

    return {
      access_token,
      refresh_token,
    };
  }
}
