import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { V0Module } from './v0/v0.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), V0Module, ServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
