import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { UsersService } from '@/services/users/users.service';
import { PunchClocksService } from '@/services/punch-clocks/punch-clocks.service';
import { AuthenticateUserController } from './controllers/authenticate-user.controller';
import { RegisterClockController } from './controllers/register-clock.controller';
import { RegisterUserController } from './controllers/register-user.controller';
import { fetchPunchClockHistoryController } from './controllers/fetch-punch-clock-history.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    RegisterUserController,
    AuthenticateUserController,
    RegisterClockController,
    fetchPunchClockHistoryController,
  ],
  providers: [UsersService, PunchClocksService],
})
export class HttpModule {}
