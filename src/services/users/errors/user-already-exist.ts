import { AppError } from '@/config/errors/app-error';

export class UserAlreadyExist extends AppError {
  constructor() {
    super('O Usuário já existe');
  }
}
