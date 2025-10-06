import { Module } from '@nestjs/common';
import { NasaController } from './nasa.controller';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [NasaController],
})
export class NasaModule {}