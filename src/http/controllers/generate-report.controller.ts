import { Roles } from '@/infra/auth/roles';
import { PunchClocksService } from '@/services/punch-clocks/punch-clocks.service';
import { Pagination } from '@/utils/pagination/pagination.decorator';
import { PaginationDto } from '@/utils/pagination/pagination.dto';
import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GenerateReportsResponseDto } from './response-dto/generate-reports-response-dto';

@Controller('admin')
export class GenerateReportController {
  constructor(private punchClockService: PunchClocksService) {}

  @Get('/reports')
  @Roles(['ADMIN'])
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: GenerateReportsResponseDto })
  @ApiQuery({ type: PaginationDto })
  async generateReports(@Pagination() dto: PaginationDto) {
    const result = await this.punchClockService.generateReport(dto);

    if (result.isLeft()) throw new BadRequestException();

    const { report } = result.value;

    return report;
  }
}
