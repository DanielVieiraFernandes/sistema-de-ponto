import { Roles } from '@/infra/auth/roles';
import { PunchClocksService } from '@/services/punch-clocks/punch-clocks.service';
import { Pagination } from '@/utils/pagination/pagination.decorator';
import { PaginationDto } from '@/utils/pagination/pagination.dto';
import { BadRequestException, Controller, Get } from '@nestjs/common';
import { RegisterPresenter } from '../presenters/register-presenter';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FetchAllPunchClocksResponseDto } from './response-dto/fetch-all-punch-clocks-response-dto';

@Controller('/admin')
export class FetchAllPunchClocksController {
  constructor(private punchClocksService: PunchClocksService) {}

  @Get('/punch-clock')
  @Roles(['ADMIN'])
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: FetchAllPunchClocksResponseDto,
  })
  @ApiQuery({ type: PaginationDto })
  async fetchAllPunchClocks(@Pagination() dto: PaginationDto) {
    const result = await this.punchClocksService.fetchAllRegisters(dto);

    const registers = result.value?.registers;

    if (!registers) throw new BadRequestException();

    return {
      registers: registers.map(RegisterPresenter.toHttp),
    };
  }
}
