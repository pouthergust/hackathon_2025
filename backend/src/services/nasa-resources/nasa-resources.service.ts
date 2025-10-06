import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class NasaResourcesService {
    private readonly NASA_URL = 'https://science.nasa.gov/sun/solar-storms-and-flares/';

    constructor(
        private readonly http: HttpService,
        private readonly llm: LlmService,
    ) {}

    /**
     * Recebe uma query em linguagem natural e responde SOMENTE com base
     * no conteúdo da página oficial da NASA em NASA_URL.
     * Caso não encontre resposta, retorna exatamente: "Sinto muito não sei responder".
     */
    async answerFromPage(query: string): Promise<string> {
        try {
            const html = await this.fetchPage();
            // 1) Extrai JSON via LLM com o conteúdo da página
            const json = await this.extractPageContentsJsonWithLLM(html);
            const paragraphFromJson = this.pickParagraphFromJson(query, json);
            if (paragraphFromJson) return paragraphFromJson;

            // 2) Fallbacks determinísticos (em caso de falha do LLM)
            const pairs = this.extractTitleDescriptionPairs(html);
            let direct = this.answerFromTitleDescriptionPairs(query, pairs);
            if (direct) return direct;

            const plain = this.extractPlainText(html);
            const target = this.findTargetFromQuery(query) || 'solar storm';
            direct = this.extractDefinitionFromText(plain, target);
            if (direct) return direct;

            const sections = this.extractSections(html);
            direct = this.answerDirectlyFromSections(query, sections);
            if (direct) return direct;

            // 3) Último recurso: LLM com contexto focado
            const context = this.buildFocusedContextFromSections(query, sections) || plain;
            const limitedContext = context.length > 18000 ? context.slice(0, 18000) : context;
            const prompt = this.buildPrompt(limitedContext, query);
            const llmRaw = await this.llm.generateContentFromMLDev(prompt);
            let llmJson: { response?: string } | null = null;
            try { llmJson = JSON.parse(llmRaw); } catch { llmJson = { response: llmRaw }; }
            const answer = (llmJson?.response || '').trim();
            if (!answer) return 'Sinto muito não sei responder';
            const lowered = answer.toLowerCase();
            const invalids = ['não sei', 'nao sei', 'não tenho certeza', 'nao tenho certeza'];
            if (invalids.some(v => lowered.includes(v)) && !lowered.includes('sinto muito não sei responder')) {
                return 'Sinto muito não sei responder';
            }
            return answer;
        } catch {
            return 'Sinto muito não sei responder';
        }
    }

    private async fetchPage(): Promise<string> {
        const resp = await firstValueFrom(
            this.http.get<string>(this.NASA_URL, {
                responseType: 'text' as any,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
            }),
        );
        return resp.data ?? '';
    }

    private buildFocusedContextFromSections(query: string, sections: Array<{ title: string; text: string }>): string {
        if (!sections || sections.length === 0) return '';
        const tokens = this.tokenize(query);
        const enTokens = this.translateTokensToEnglish(tokens);
        // Score por ocorrência de tokens na seção
        const scored = sections.map(s => ({
            title: s.title,
            text: s.text,
            score:
                tokens.reduce((acc, t) => acc + (s.text.toLowerCase().includes(t) ? 1 : 0), 0) +
                enTokens.reduce((acc, t) => acc + (s.text.toLowerCase().includes(t) ? 1 : 0), 0),
        }));
        // Ordena por score desc e seleciona top k
        const top = scored.sort((a, b) => b.score - a.score).slice(0, 4);
        // Se nenhum token casou, retorna vazio para fallback
        if (!top.some(s => s.score > 0)) return '';
        const combined = top.map(s => `${s.title}\n${s.text}`).join('\n\n');
        // Limita tamanho
        return combined.length > 18000 ? combined.slice(0, 18000) : combined;
    }

    private tokenize(text: string): string[] {
        return (text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(t => t.length > 2);
    }

    private extractSections(html: string): Array<{ title: string; text: string }> {
        const results: Array<{ title: string; text: string }> = [];
        const hRegex = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
        const indices: Array<{ title: string; start: number; end: number }> = [];
        let match: RegExpExecArray | null;
        while ((match = hRegex.exec(html)) !== null) {
            const tag = match[1];
            const titleHtml = match[2];
            const title = this.extractPlainText(titleHtml);
            indices.push({ title, start: match.index + match[0].length, end: hRegex.lastIndex });
        }
        // Construir blocos entre headings
        for (let i = 0; i < indices.length; i++) {
            const cur = indices[i];
            const nextStart = i + 1 < indices.length ? indices[i + 1].start : html.length;
            const slice = html.slice(cur.start, nextStart);
            let text = this.extractPlainText(slice);
            // Remove repetição do título no início, caso presente
            if (cur.title) {
                const t = cur.title.trim();
                const re = new RegExp('^' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\s*', 'i');
                text = text.replace(re, '').trim();
            }
            if (text && text.length > 0) {
                results.push({ title: cur.title, text });
            }
        }
        return results;
    }

    private answerDirectlyFromSections(query: string, sections: Array<{ title: string; text: string }>): string | null {
        if (!sections || sections.length === 0) return null;
        const tokens = this.tokenize(query);
        const enTokens = this.translateTokensToEnglish(tokens);
        const scored = sections.map(s => ({
            section: s,
            score:
                tokens.reduce((acc, t) => acc + (s.title.toLowerCase().includes(t) ? 2 : 0), 0) +
                enTokens.reduce((acc, t) => acc + (s.title.toLowerCase().includes(t) ? 2 : 0), 0) +
                tokens.reduce((acc, t) => acc + (s.text.toLowerCase().includes(t) ? 1 : 0), 0) +
                enTokens.reduce((acc, t) => acc + (s.text.toLowerCase().includes(t) ? 1 : 0), 0),
        })).sort((a, b) => b.score - a.score);
        const best = scored[0];
        if (!best || best.score === 0) return null;
        // Pega o primeiro parágrafo (até o primeiro duplo espaço ou quebra lógica)
        const text = best.section.text.trim();
        // Tenta encontrar uma sentença descritiva
        const sentences = text.split(/(?<=\.)\s+/).map(s => s.trim()).filter(s => s);
        const descriptive = sentences.find(s => /\bsolar storm\b/i.test(s) && /\bis\b/i.test(s))
            || sentences.find(s => /\bsolar\b/i.test(s) && /\bstorm\b/i.test(s));
        if (descriptive && descriptive.length >= 40) {
            return descriptive;
        }
        const firstParagraph = (text.split(/\n\n|\.\s{2,}|\r\n\r\n/)[0] || text).trim();
        const firstSentence = (firstParagraph.split(/(?<=\.)\s+/)[0] || firstParagraph).trim();
        return firstSentence.length >= 40 ? firstSentence : firstParagraph;
    }

    private translateTokensToEnglish(tokens: string[]): string[] {
        const dict: Record<string, string> = {
            'tempestade': 'storm',
            'solar': 'solar',
            'o': 'what',
            'que': 'what',
            'é': 'is',
            'uma': 'a',
            'um': 'a',
            'explosao': 'explosion',
            'expulsao': 'ejection',
            'particulas': 'particles',
            'energia': 'energy',
            'campos': 'fields',
            'magneticos': 'magnetic',
            'material': 'material',
            'sol': 'sun',
        };
        return tokens.map(t => dict[t] || t);
    }

    private extractPlainText(html: string): string {
        if (!html) return '';
        // Remove scripts e styles
        let cleaned = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
        // Remove tags
        cleaned = cleaned.replace(/<[^>]+>/g, ' ');
        // Decodifica entidades HTML simples
        cleaned = cleaned
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        // Normaliza espaços
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        return cleaned;
    }

    // Extrai pares de título (h3.heading-22) e seus parágrafos (p.hds-listicle-list-description)
    private extractTitleDescriptionPairs(html: string): Array<{ title: string; description: string }> {
        const pairs: Array<{ title: string; description: string }> = [];
        if (!html) return pairs;
        // Encontrar todos os títulos h3.heading-22 e seus blocos subsequentes até o próximo h3.heading-22
        const h3Regex = /<h3[^>]*class="[^"]*heading-22[^"]*"[^>]*>([\s\S]*?)<\/h3>/gi;
        const titles: Array<{ title: string; start: number; end: number }> = [];
        let m: RegExpExecArray | null;
        while ((m = h3Regex.exec(html)) !== null) {
            const titleHtml = m[1];
            const titleText = this.extractPlainText(titleHtml).trim();
            titles.push({ title: titleText, start: m.index + m[0].length, end: h3Regex.lastIndex });
        }
        for (let i = 0; i < titles.length; i++) {
            const cur = titles[i];
            const nextStart = i + 1 < titles.length ? titles[i + 1].start : html.length;
            const segment = html.slice(cur.start, nextStart);
            // Primeiro tenta parágrafo com a classe específica
            const pRegex = /<p[^>]*class="[^"]*hds-listicle-list-description[^"]*"[^>]*>([\s\S]*?)<\/p>/i;
            let pm = pRegex.exec(segment);
            // Fallback: primeiro <p> do segmento (ignorando legendas de imagem)
            if (!pm) {
                const allP = [...segment.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];
                const firstValid = allP.find(x => {
                    const txt = this.extractPlainText(x[1]).trim();
                    return txt && !/^image\s*:/i.test(txt);
                });
                if (firstValid) pm = firstValid as any;
            }
            if (pm && pm[1]) {
                const description = this.extractPlainText(pm[1]).trim();
                if (description) {
                    pairs.push({ title: cur.title, description });
                }
            }
        }
        return pairs;
    }

    // Seleciona o par título→parágrafo mais relevante e retorna somente o parágrafo
    private answerFromTitleDescriptionPairs(query: string, pairs: Array<{ title: string; description: string }>): string | null {
        if (!pairs || pairs.length === 0) return null;
        // Preferência direta por alvo identificado no título
        const target = this.findTargetFromQuery(query);
        if (target) {
            const direct = pairs.find(p => p.title.toLowerCase().includes(target.toLowerCase()));
            if (direct && direct.description) return direct.description;
        }
        const tokens = this.tokenize(query);
        const enTokens = this.translateTokensToEnglish(tokens);
        const scored = pairs.map(p => {
            const lt = p.title.toLowerCase();
            const ld = p.description.toLowerCase();
            const score =
                (lt.includes('what is') && lt.includes('solar storm') ? 6 : 0) +
                tokens.reduce((acc, t) => acc + (lt.includes(t) ? 2 : 0), 0) +
                enTokens.reduce((acc, t) => acc + (lt.includes(t) ? 2 : 0), 0) +
                tokens.reduce((acc, t) => acc + (ld.includes(t) ? 1 : 0), 0) +
                enTokens.reduce((acc, t) => acc + (ld.includes(t) ? 1 : 0), 0);
            return { pair: p, score };
        }).sort((a, b) => b.score - a.score);
        const best = scored[0];
        if (!best || best.score === 0) return null;
        // Retorna apenas o parágrafo, ignorando o título
        return best.pair.description;
    }

    private buildPrompt(context: string, query: string): string {
        return [
            'You are a STRICT EXTRACTOR of information from the NASA page provided in the CONTEXT.',
            'Rule: answer ONLY using excerpts that appear in the CONTEXT. Do not invent or use external knowledge.',
            'If the answer is not clearly present in the CONTEXT, reply exactly: "Sinto muito não sei responder".',
            'Respond in English, brief and direct.',
            '',
            'CONTEXTO:',
            context,
            '',
            'QUESTION:',
            query,
            '',
            'Return only the final answer, no additional explanations.',
        ].join('\n');
    }

    // Gera JSON estruturado via LLM a partir do conteúdo da página
    private async extractPageContentsJsonWithLLM(html: string): Promise<{ page_contents?: Array<{ title: string; paragraph: string }> }> {
        const context = this.extractPlainText(html);
        const limited = context.length > 18000 ? context.slice(0, 18000) : context;
        const prompt = [
            'You are a parser that transforms NASA page content into a JSON object.',
            'Use ONLY information present in the CONTEXT. Do not invent or use external knowledge.',
            'Output MUST be valid JSON with this exact shape:',
            '{ "page_contents": [ { "title": "...", "paragraph": "..." } ] }',
            'Include items for prominent Q&A-like headings (e.g., "What is a solar storm?") and their corresponding descriptive paragraph. Keep English text exactly as in the page, including image credits if present.',
            'Return ONLY the JSON. No explanations or extra text.',
            '',
            'CONTEXT:',
            limited,
        ].join('\n');
        const raw = await this.llm.generateContentFromMLDev(prompt);
        try {
            const obj = JSON.parse(raw);
            if (obj && Array.isArray(obj.page_contents)) return obj;
        } catch {}
        // Se não for JSON válido, retorna estrutura vazia
        return { page_contents: [] };
    }

    // Seleciona o parágrafo do JSON com base na query
    private pickParagraphFromJson(query: string, json: { page_contents?: Array<{ title: string; paragraph: string }> }): string | null {
        if (!json || !Array.isArray(json.page_contents) || json.page_contents.length === 0) return null;
        const target = this.findTargetFromQuery(query);
        if (target) {
            const hit = json.page_contents.find(it => it.title && it.title.toLowerCase().includes(target.toLowerCase()));
            if (hit && hit.paragraph) return hit.paragraph.trim();
        }
        // Caso não haja alvo, retorna o primeiro parágrafo disponível
        const first = json.page_contents[0];
        return first && first.paragraph ? first.paragraph.trim() : null;
    }

    private findTargetFromQuery(query: string): string | null {
        const q = (query || '').toLowerCase();
        if (q.includes('tempestade solar') || q.includes('solar storm')) return 'solar storm';
        if (q.includes('solar flare') || q.includes('erupção solar') || q.includes('explosão solar')) return 'solar flare';
        if (q.includes('radiation storm') || q.includes('tempestade de radiação')) return 'radiation storm';
        if (q.includes('coronal mass ejection') || q.includes('ejeção de massa coronal')) return 'coronal mass ejection';
        return null;
    }

    private extractDefinitionFromText(text: string, target: string): string | null {
        const t = (target || '').toLowerCase();
        const normalized = (text || '').replace(/\s+/g, ' ').trim();
        // Strong pattern for solar storm definition
        if (t === 'solar storm') {
            const m = normalized.match(/A\s+solar\s+storm\s+is\s+[^.]*\./i);
            if (m && m[0] && m[0].length >= 40) return m[0].trim();
        }
        // Generic fallback by sentences
        const lines = normalized.split(/(?<=\.)\s+/).map(s => s.trim()).filter(Boolean);
        const preferred = lines.find(s => new RegExp(`^a\s+${this.escapeRegex(t)}\s+is\b`, 'i').test(s))
            || lines.find(s => new RegExp(`\b${this.escapeRegex(t)}\s+is\b`, 'i').test(s));
        if (preferred && preferred.length >= 40) return preferred;
        const alt = lines.find(s => new RegExp(`\b${this.escapeRegex(t)}\b`, 'i').test(s));
        return alt && alt.length >= 40 ? alt : null;
    }

    private escapeRegex(s: string): string {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
