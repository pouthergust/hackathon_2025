import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {

    checkHealth(): string {
        return 'Healthy';
    }
}
