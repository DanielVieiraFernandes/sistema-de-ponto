import { Body, Controller, Post } from '@nestjs/common';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { Roles } from 'src/infra/auth/roles';
import { User } from 'src/infra/auth/user.decorator';
import { CreatePunchClockDto } from 'src/services/punch-clocks/dto/create-punch-clock-dto';
import { PunchClocksService } from 'src/services/punch-clocks/punch-clocks.service';

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
