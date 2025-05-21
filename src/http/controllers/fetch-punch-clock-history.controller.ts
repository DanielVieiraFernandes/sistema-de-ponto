import { Controller, Get, Query } from '@nestjs/common';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { User } from 'src/infra/auth/user.decorator';
import { FetchPunchClocksDto } from 'src/services/punch-clocks/dto/fetch-punch-clocks-dto';
import { PunchClocksService } from 'src/services/punch-clocks/punch-clocks.service';
import { PunchClockPresenter } from '../presenters/punch-clock-presenter';

@Controller()
export class fetchPunchClockHistoryController {
  constructor(private punchClocksService: PunchClocksService) {}

  @Get('/punch-clock/history')
  async fetchPunchClockHistory(
    @User() user: UserPayload,
    @Query() query: FetchPunchClocksDto,
  ) {
    const result = await this.punchClocksService.fetchPunchClockHistory(
      user.sub,
      query,
    );

    const points = result.value?.points;

    return {
      points: points?.map(PunchClockPresenter.toHttp),
    };
  }
}
