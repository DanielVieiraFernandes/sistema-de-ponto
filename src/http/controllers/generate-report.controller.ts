import { PunchClocksService } from '@/services/punch-clocks/punch-clocks.service';
import { Pagination } from '@/utils/pagination/pagination.decorator';
import { PaginationDto } from '@/utils/pagination/pagination.dto';
import { BadRequestException, Controller, Get } from '@nestjs/common';

@Controller('admin')
export class GenerateReportController {
  constructor(private punchClockService: PunchClocksService) {}

  @Get('/reports')
  async generateReports(@Pagination() dto: PaginationDto) {
    const result = await this.punchClockService.generateReport(dto);

    if (result.isLeft()) throw new BadRequestException();

    const { report } = result.value;

    return report;
  }
}
