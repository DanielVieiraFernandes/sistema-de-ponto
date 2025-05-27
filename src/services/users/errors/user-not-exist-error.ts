import { AppError } from '@/config/errors/app-error';

export class UserNotExistError extends AppError {
  constructor() {
    super('user not exist');
  }
}
