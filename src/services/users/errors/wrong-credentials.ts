import { AppError } from '@/config/errors/app-error';

export class WrongCredentials extends AppError {
  constructor() {
    super(
      'Credenciais inválidas, não há nenhum usuário com esse e-mail e/ou senha',
    );
  }
}
