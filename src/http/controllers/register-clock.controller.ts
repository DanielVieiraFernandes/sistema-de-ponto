import { Body, Controller, Post } from '@nestjs/common';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Roles } from '@/infra/auth/roles';
import { User } from '@/infra/auth/user.decorator';
import { CreatePunchClockDto } from '@/services/punch-clocks/dto/create-punch-clock-dto';
import { PunchClocksService } from '@/services/punch-clocks/punch-clocks.service';
import { ApiBearerAuth, ApiRequestTimeoutResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

@Controller()
export class RegisterClockController {
  constructor(private punchClocksService: PunchClocksService) {}

  @Post('/punch-clock')
  @Roles(['EMPLOYEE'])
  @ApiBearerAuth()
  async registerClock(
    @User() user: UserPayload,
    @Body() dto: CreatePunchClockDto,
  ) {
    const result = await this.punchClocksService.registerClock(user.sub, dto);

    const timestamp = result.value?.timestamp;

    return {
      message: 'Ponto registrado com sucesso',
      timestamp,
    };
  }
}
