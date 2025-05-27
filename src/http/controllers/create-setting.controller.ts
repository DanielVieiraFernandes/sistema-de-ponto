import { Roles } from '@/infra/auth/roles';
import { CreateSettingsDto } from '@/services/settings/dto/create-settings-dto';
import { SettingsService } from '@/services/settings/settings.service';
import { Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';

@Controller('admin')
export class CreateSettingController {
  constructor(private settingsService: SettingsService) {}

  @Post('/setting')
  @HttpCode(204)
  @Roles(['ADMIN'])
  async createSetting(@Body() dto: CreateSettingsDto) {
    const result = await this.settingsService.createSettings(dto);

    if (result.isLeft()) {
      const error = result.value;

      throw new ConflictException(error.message);
    }
  }
}
