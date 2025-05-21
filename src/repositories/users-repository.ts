import { User } from '@prisma/client';
import { CreateUserDto } from '@/services/users/dto/create-user-dto';

export abstract class UsersRepository {
  abstract create(dto: CreateUserDto): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
