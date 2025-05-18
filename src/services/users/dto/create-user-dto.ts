import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6, { message: 'A senha deve conter somente 6 caracteres' })
  password: string;

  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
}
