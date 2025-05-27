import { RegisterMapperResponse } from '@/infra/database/prisma/mappers/register-mapper';
import dayjs from 'dayjs';

export class RegisterPresenter {
  static toHttp(register: RegisterMapperResponse) {
    return {
      'employee': register.employee,
      'date': register.date,
      'check-in': dayjs(register.checkIn).format('HH:mm'),
      'check-out': dayjs(register.checkOut).format('HH:mm'),
      'hours_worked': register.hoursWorked,
    };
  }
}
