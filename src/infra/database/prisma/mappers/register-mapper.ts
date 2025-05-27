import { HistoryPunchClockMapper } from './history-punch-clock-mapper';

export interface RegisterMapperResponse {
  employee: string;
  date: string;
  checkIn: Date;
  checkOut: Date;
  hoursWorked: number;
}

export class RegisterMapper {
  static toHttp(
    history: HistoryPunchClockMapper,
    name: string,
  ): RegisterMapperResponse {
    return {
      employee: name,
      date: history.date,
      checkIn: history.checkIn,
      checkOut: history.checkOut,
      hoursWorked: history.hoursWorked,
    };
  }
}
