import dayjs from 'dayjs';
import { HistoryPunchClockMapper } from 'src/infra/database/prisma/mappers/history-punch-clock-mapper';

export class PunchClockPresenter {
  static toHttp(point: HistoryPunchClockMapper) {
    return {
      date: dayjs(point.date).format('yyyy-mm-dd'),
      'check-in': dayjs(point.checkIn).format('HH:mm'),
      'check-out': dayjs(point.checkOut).format('HH:mm'),
      'hours-worked': point.hoursWorked.toFixed(0),
    };
  }
}
