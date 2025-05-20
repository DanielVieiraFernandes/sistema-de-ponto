import { Module } from '@nestjs/common';
import { RegisterUserController } from './register-user.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { UsersService } from 'src/services/users/users.service';
import { AuthenticateUserController } from './authenticate-user.controller';
import { RegisterClockController } from './register-clock.controller';
import { PunchClocksService } from 'src/services/punch-clocks/punch-clocks.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    RegisterUserController,
    AuthenticateUserController,
    RegisterClockController,
  ],
  providers: [UsersService, PunchClocksService],
})
export class ControllersModule {}
