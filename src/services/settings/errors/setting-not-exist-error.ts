import { AppError } from '@/config/errors/app-error';

export class SettingNotExistError extends AppError {
  constructor() {
    super('setting not exist');
  }
}
