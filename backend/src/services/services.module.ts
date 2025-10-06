import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LlmService } from './llm/llm.service';
import { NasaResourcesService } from './nasa-resources/nasa-resources.service';

@Module({
    imports: [HttpModule],
    providers: [LlmService, NasaResourcesService],
    exports: [LlmService, NasaResourcesService],
})
export class ServicesModule {}
