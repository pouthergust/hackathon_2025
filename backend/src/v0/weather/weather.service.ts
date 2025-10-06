import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
    constructor(private readonly httpService: HttpService) {}
    
  async getWeather(city: string): Promise<any> {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response: any = await firstValueFrom(this.httpService.get(url));
    return response?.data;
  }
}
