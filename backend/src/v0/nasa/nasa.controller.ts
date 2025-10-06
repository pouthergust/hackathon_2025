import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { NasaResourcesService } from '../../services/nasa-resources/nasa-resources.service';

@Controller('v0/nasa')
export class NasaController {
  constructor(private readonly nasa: NasaResourcesService) {}

  @Get()
  async query(@Query('q') q?: string): Promise<{ answer: string }> {
    const query = (q || '').trim();
    if (!query) {
      throw new BadRequestException('Missing query parameter: q');
    }
    const answer = await this.nasa.answerFromPage(query);
    return { answer };
  }
}