import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { MessagesModule } from './messages/messages.module';
import { WeatherModule } from './weather/weather.module';

@Module({
    imports: [HealthModule, MessagesModule, WeatherModule],
})
export class V0Module {}
