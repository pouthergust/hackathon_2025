import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { MessagesModule } from './messages/messages.module';
import { WeatherModule } from './weather/weather.module';
import { NasaModule } from './nasa/nasa.module';

@Module({
    imports: [HealthModule, MessagesModule, WeatherModule, NasaModule],
})
export class V0Module {}
