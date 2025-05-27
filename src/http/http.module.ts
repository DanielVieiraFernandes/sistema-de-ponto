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
import { CreateSettingController } from './controllers/create-setting.controller';
import { SettingsService } from '@/services/settings/settings.service';
import { UpdateSettingController } from './controllers/update-setting.controller';
import { EnvService } from '@/infra/env/env.service';
import { EnvModule } from '@/infra/env/env.module';

@Module({
  imports: [DatabaseModule, EnvModule],
  controllers: [
    RegisterUserController,
    AuthenticateUserController,
    RegisterClockController,
    FetchPunchClockHistoryController,
    FetchAllPunchClocksController,
    GenerateReportController,
    CreateSettingController,
    UpdateSettingController,
  ],
  providers: [UsersService, PunchClocksService, SettingsService],
})
export class HttpModule {}
