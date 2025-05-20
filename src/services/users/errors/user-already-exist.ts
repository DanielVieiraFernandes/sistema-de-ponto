import { AppError } from 'src/config/errors/app-error';

export class UserAlreadyExist extends AppError {
  constructor() {
    super('O Usuário já existe');
  }
}
