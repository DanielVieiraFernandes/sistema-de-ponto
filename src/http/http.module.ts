import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { UsersService } from '@/services/users/users.service';
import { PunchClocksService } from '@/services/punch-clocks/punch-clocks.service';
import { AuthenticateUserController } from './controllers/authenticate-user.controller';
import { RegisterClockController } from './controllers/register-clock.controller';
import { RegisterUserController } from './controllers/register-user.controller';
import { FetchPunchClockHistoryController } from './controllers/fetch-punch-clock-history.controller';
import { FetchAllPunchClocksController } from './controllers/fetch-all-punch-clocks.controller';
import { GenerateReportController } from './controllers/generate-report.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    RegisterUserController,
    AuthenticateUserController,
    RegisterClockController,
    FetchPunchClockHistoryController,
    FetchAllPunchClocksController,
    GenerateReportController,
  ],
  providers: [UsersService, PunchClocksService],
})
export class HttpModule {}
