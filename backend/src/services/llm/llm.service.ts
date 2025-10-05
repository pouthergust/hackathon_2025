import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
    constructor(private readonly config: ConfigService) {}

    async generateContentFromMLDev(contents: string) {
        const apiKey = this.config.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('Missing GEMINI_API_KEY environment variable');
        }
        const ai = new GoogleGenAI({vertexai: false, apiKey});
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents,
        });
        console.debug(response.text);
        return JSON.stringify({response: response.text});
    }
}
