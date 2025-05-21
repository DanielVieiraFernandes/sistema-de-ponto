import { Body, Controller, Post } from '@nestjs/common';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Roles } from '@/infra/auth/roles';
import { User } from '@/infra/auth/user.decorator';
import { CreatePunchClockDto } from '@/services/punch-clocks/dto/create-punch-clock-dto';
import { PunchClocksService } from '@/services/punch-clocks/punch-clocks.service';

@Controller()
export class RegisterClockController {
  constructor(private punchClocksService: PunchClocksService) {}

  @Post('/punch-clock')
  @Roles(['EMPLOYEE'])
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
