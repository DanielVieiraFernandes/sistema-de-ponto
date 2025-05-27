import { CreateSettingsDto } from '@/services/settings/dto/create-settings-dto';
import { UpdateSettingsDto } from '@/services/settings/dto/update-settings-dto';
import { Settings } from '@prisma/client';

export abstract class SettingsRepository {
  abstract create(dto: CreateSettingsDto): Promise<void>;
  abstract findById(id: string): Promise<Settings | null>;
  abstract save(id: string, dto: UpdateSettingsDto): Promise<Settings>;
  abstract findAnything(): Promise<Settings | null>;
}
