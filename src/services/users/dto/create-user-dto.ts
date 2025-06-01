import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'O nome completo do usuário',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@email.com',
    description: 'O endereço de e-mail único do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'A senha do usuário com exatamente 6 caracteres',
  })
  @IsString()
  @Length(6, 6, { message: 'A senha deve conter exatamente 6 caracteres' })
  password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'A função do usuário no sistema',
    example: UserRole.EMPLOYEE,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole, { message: 'A função fornecida não é válida.' })
  role: UserRole;
}
