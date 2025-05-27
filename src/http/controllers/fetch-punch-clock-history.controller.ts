import { Controller, Get, Query } from '@nestjs/common';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { User } from '@/infra/auth/user.decorator';
import { FetchPunchClocksDto } from '@/services/punch-clocks/dto/fetch-punch-clocks-dto';
import { PunchClocksService } from '@/services/punch-clocks/punch-clocks.service';
import { PunchClockPresenter } from '../presenters/punch-clock-presenter';
import { Pagination } from '@/utils/pagination/pagination.decorator';
import { PaginationDto } from '@/utils/pagination/pagination.dto';

@Controller()
export class FetchPunchClockHistoryController {
  constructor(private punchClocksService: PunchClocksService) {}

  @Get('/punch-clock/history')
  async fetchPunchClockHistory(
    @User() user: UserPayload,
    @Pagination() { page }: PaginationDto,
  ) {
    const result = await this.punchClocksService.fetchPunchClockHistory(
      user.sub,
      page,
    );

    const points = result.value?.points;

    return {
      points: points?.map(PunchClockPresenter.toHttp),
    };
  }
}
