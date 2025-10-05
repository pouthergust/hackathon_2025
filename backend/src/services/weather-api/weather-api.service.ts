// src/services/weather-api/weather-api.service.ts

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios'; // Importe AxiosResponse

// DTO (Data Transfer Object)
export interface CurrentWeather {
  temperature: number; // Em graus Fahrenheit
  isRaining: boolean;
  location: {
    lat: number;
    lon: number;
  };
}

@Injectable()
export class WeatherApiService {
  private readonly logger = new Logger(WeatherApiService.name);
  private readonly USER_NAME: string;
  private readonly PASSWORD: string;
  private readonly API_BASE_URL = 'https://api.meteomatics.com';

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    // CORREÇÃO: Adicionado '|| ""' para resolver o erro de tipo.
    // Isso garante que, se a variável de ambiente não for encontrada, o valor será uma string vazia.
    this.USER_NAME = this.config.get<string>('METEOMATICS_USERNAME') || '';
    this.PASSWORD = this.config.get<string>('METEOMATICS_PASSWORD') || '';

    // Esta verificação continua sendo importante para falhar de forma explícita
    if (!this.USER_NAME || !this.PASSWORD) {
      throw new Error('As credenciais da API Meteomatics não foram configuradas no .env');
    }
  }

  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const parameters = 't_2m:F,is_raining:idx';
    const time = 'now';
    const url = `${this.API_BASE_URL}/${time}/${parameters}/${lat},${lon}/json`;
    
    this.logger.log(`Requisitando dados do tempo para lat: ${lat}, lon: ${lon}`);

    try {
      // CORREÇÃO: Adicionado o tipo 'AxiosResponse<any>' para a variável 'response'.
      // Isso resolve o erro "'response' is of type 'unknown'".
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(url, {
          auth: {
            username: this.USER_NAME,
            password: this.PASSWORD,
          },
        }),
      );

      return this.formatApiResponse(response.data, lat, lon);

    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(`Falha ao buscar dados do tempo: ${axiosError.message}`, axiosError.stack);
      
      if (axiosError.response?.status === 404) {
          throw new NotFoundException(`Não foi possível encontrar dados para a localização (${lat}, ${lon})`);
      }
      
      throw new Error('Erro na comunicação com a API de meteorologia.');
    }
  }
  
  private formatApiResponse(apiData: any, lat: number, lon: number): CurrentWeather {
    const tempData = apiData.data.find(p => p.parameter === 't_2m:F');
    const rainData = apiData.data.find(p => p.parameter === 'is_raining:idx');

    if (!tempData || !rainData || tempData.coordinates[0].dates.length === 0 || rainData.coordinates[0].dates.length === 0) {
        throw new NotFoundException('A resposta da API não continha os dados esperados.');
    }

    const temperatureValue = tempData.coordinates[0].dates[0].value;
    const isRainingValue = rainData.coordinates[0].dates[0].value;

    return {
      temperature: temperatureValue,
      isRaining: isRainingValue === 1,
      location: { lat, lon },
    };
  }
}