import { UpdateSettingsDto } from '@/services/settings/dto/update-settings-dto';
import { SettingsService } from '@/services/settings/settings.service';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('admin')
export class UpdateSettingController {
  constructor(private settingsService: SettingsService) {}

  @Put('/setting/:id')
  @ApiBearerAuth()
  async updateSetting(@Param('id') id: string, @Body() dto: UpdateSettingsDto) {
    const result = await this.settingsService.updateSettings(id, dto);

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    const { setting } = result.value;

    return {
      setting,
    };
  }
}
