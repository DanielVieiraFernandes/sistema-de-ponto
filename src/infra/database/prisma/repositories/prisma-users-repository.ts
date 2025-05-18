import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersRepository } from 'src/repositories/users-repository';
import { CreateUserDto } from 'src/services/users/dto/create-user-dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
