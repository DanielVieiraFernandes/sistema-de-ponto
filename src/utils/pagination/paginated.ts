import { PaginationDto } from './pagination.dto';

export class Paginated {
  private size: number;

  readonly page: number;
  readonly take: number;
  readonly skip: number;
  readonly employeeId: string | null;
  readonly endDate: Date | null;
  readonly startDate: Date | null;

  constructor({ employeeId, endDate, page, size, startDate }: PaginationDto) {
    this.page = page;
    this.size = size ?? 20;

    this.take = (this.page - 1) * this.size;
    this.skip = this.size;
    this.employeeId = employeeId ?? null;
    this.startDate = startDate ?? null;
    this.endDate = endDate ?? null;
  }
}
