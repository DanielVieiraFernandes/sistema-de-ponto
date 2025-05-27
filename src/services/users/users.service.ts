import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/repositories/users-repository';
import { CreateUserDto } from './dto/create-user-dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Either, left, right } from '@/config/errors/either';
import { UserAlreadyExist } from './errors/user-already-exist';
import { WrongCredentials } from './errors/wrong-credentials';
import { AuthenticateUserDto } from './dto/authenticate-user-dto';
import { UserRole } from '@prisma/client';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { UserNotExistError } from './errors/user-not-exist-error';

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
        refreshToken: string;
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
    const refreshToken = this.jwt.sign(
      { sub: user.id, role: user.role },
      {
        expiresIn: '7d',
      },
    );

    return right({
      accessToken,
      refreshToken,
    });
  }

  async authenticateUser({ email, password }: AuthenticateUserDto): Promise<
    Either<
      WrongCredentials,
      {
        accessToken: string;
        refreshToken: string;
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
    const refreshToken = this.jwt.sign(
      { sub: user.id, role: user.role },
      {
        expiresIn: '7d',
      },
    );

    return right({
      accessToken,
      refreshToken,
    });
  }

  async generateNewTokens(refreshToken: string): Promise<
    Either<
      UserNotExistError,
      {
        accessToken: string;
        refreshToken: string;
      }
    >
  > {
    const { role, sub }: UserPayload = await this.jwt.verify(refreshToken);

    const user = await this.usersRepository.findById(sub);

    if (!user) {
      return left(new UserNotExistError());
    }

    const newAccessToken = this.jwt.sign({ sub: user.id, role: user.role });
    const newRefreshToken = this.jwt.sign(
      { sub: user.id, role: user.role },
      {
        expiresIn: '7d',
      },
    );

    return right({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }
}
