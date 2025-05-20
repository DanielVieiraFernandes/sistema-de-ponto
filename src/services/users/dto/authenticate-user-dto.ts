import { IsEmail, IsString, Length } from 'class-validator';

export class AuthenticateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6, { message: 'A senha deve conter exatos 6 caracteres' })
  password: string;
}
