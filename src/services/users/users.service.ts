import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/repositories/users-repository';
import { CreateUserDto } from './dto/create-user-dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Either, left, right } from '@/config/errors/either';
import { UserAlreadyExist } from './errors/user-already-exist';
import { WrongCredentials } from './errors/wrong-credentials';
import { AuthenticateUserDto } from './dto/authenticate-user-dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private jwt: JwtService,
  ) {}

  async registerUser(dto: CreateUserDto): Promise<
    Either<
      UserAlreadyExist,
      {
        accessToken: string;
      }
    >
  > {
    const isExist = await this.usersRepository.findByEmail(dto.email);

    if (isExist) {
      return left(new UserAlreadyExist());
    }

    const passwordHashed = await hash(dto.password, 9);

    const user = await this.usersRepository.create({
      ...dto,
      password: passwordHashed,
    });

    const accessToken = this.jwt.sign({ sub: user.id, role: user.role });

    return right({
      accessToken,
    });
  }

  async authenticateUser({ email, password }: AuthenticateUserDto): Promise<
    Either<
      WrongCredentials,
      {
        accessToken: string;
      }
    >
  > {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentials());
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return left(new WrongCredentials());
    }

    const accessToken = this.jwt.sign({ sub: user.id, role: user.role });

    return right({
      accessToken,
    });
  }
}
