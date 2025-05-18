import { Module } from '@nestjs/common';
import { RegisterUserController } from './register-user.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { UsersService } from 'src/services/users/users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RegisterUserController],
  providers: [UsersService],
})
export class ControllersModule {}
