import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/users-repository';
import { CreateUserDto } from './dto/create-user-dto';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private jwt: JwtService,
  ) {}

  async registerUser(dto: CreateUserDto) {
    const isExist = await this.usersRepository.findByEmail(dto.email);

    if (isExist) {
      throw new Error();
    }

    const passwordHashed = await hash(dto.password, 9);

    const user = await this.usersRepository.create({
      ...dto,
      password: passwordHashed,
    });

    const accessToken = this.jwt.sign({ sub: user.id, role: user.role });

    return {
      accessToken,
    };
  }
}
