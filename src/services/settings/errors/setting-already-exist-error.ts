import { AppError } from '@/config/errors/app-error';

export class SettingAlreadyExistError extends AppError {
  constructor() {
    super('setting already exist error');
  }
}
