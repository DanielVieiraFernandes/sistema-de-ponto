import { SettingsRepository } from '@/repositories/settings-repository';
import { Injectable } from '@nestjs/common';
import { CreateSettingsDto } from './dto/create-settings-dto';
import { Either, left, right } from '@/config/errors/either';
import { SettingAlreadyExistError } from './errors/setting-already-exist-error';
import { UpdateSettingsDto } from './dto/update-settings-dto';
import { SettingNotExistError } from './errors/setting-not-exist-error';
import { Settings } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private settingsRepository: SettingsRepository) {}

  async createSettings(
    dto: CreateSettingsDto,
  ): Promise<Either<SettingAlreadyExistError, {}>> {
    const isExistAnySetting = await this.settingsRepository.findAnything();

    if (isExistAnySetting) {
      return left(new SettingAlreadyExistError());
    }

    await this.settingsRepository.create(dto);

    return right({});
  }

  async updateSettings(
    id: string,
    dto: UpdateSettingsDto,
  ): Promise<
    Either<
      SettingNotExistError,
      {
        setting: Settings;
      }
    >
  > {
    const isSettingExist = await this.settingsRepository.findById(id);

    if (!isSettingExist) {
      return left(new SettingNotExistError());
    }

    const setting = await this.settingsRepository.save(id, dto);

    return right({
      setting,
    });
  }
}
