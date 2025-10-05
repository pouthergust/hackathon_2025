import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { WeatherApiService } from 'src/services/weather-api/weather-api.service';

@Injectable()
export class WeatherService {
    constructor(api: WeatherApiService) {}
    
  async getWeather(city: string): Promise<any> {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response: AxiosResponse<any> = await axios.get(url);
    return response.data;
  }
}
