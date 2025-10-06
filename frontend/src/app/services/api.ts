import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly http = inject(HttpClient);
  // Base do backend (v0)
  private readonly baseUrl = 'https://squid-app-jyggz.ondigitalocean.app/v0';

  // Métodos genéricos
  get$<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
    const url = this.buildUrl(path);
    const httpParams = this.buildParams(params);
    const httpHeaders = this.buildHeaders(headers);
    return this.http.get<T>(url, { params: httpParams, headers: httpHeaders });
  }

  post$<T>(path: string, body?: any, headers?: Record<string, string>): Observable<T> {
    const url = this.buildUrl(path);
    const httpHeaders = this.buildHeaders(headers, true);
    return this.http.post<T>(url, body ?? {}, { headers: httpHeaders });
  }

  put$<T>(path: string, body?: any, headers?: Record<string, string>): Observable<T> {
    const url = this.buildUrl(path);
    const httpHeaders = this.buildHeaders(headers, true);
    return this.http.put<T>(url, body ?? {}, { headers: httpHeaders });
  }

  delete$<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
    const url = this.buildUrl(path);
    const httpParams = this.buildParams(params);
    const httpHeaders = this.buildHeaders(headers);
    return this.http.delete<T>(url, { params: httpParams, headers: httpHeaders });
  }

  // Wrappers de recursos comuns
  health$(): Observable<{ status: string }> {
    return this.get$<{ status: string }>('/health');
  }

  sendMessage$(message: string): Observable<string> {
    return this.post$<string>('/messages/send', { message });
  }

  // NASA endpoint (v0/nasa)
  nasa$(q: string): Observable<{ answer: string }> {
    return this.get$<{ answer: string }>('/nasa', { q });
  }

  // Helpers
  private buildUrl(path: string): string {
    const clean = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseUrl}/${clean}`;
  }

  private buildParams(params?: Record<string, any>): HttpParams | undefined {
    if (!params) return undefined;
    let hp = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      hp = hp.append(key, String(value));
    }
    return hp;
  }

  private buildHeaders(headers?: Record<string, string>, json = false): HttpHeaders | undefined {
    const defaults: Record<string, string> = json ? { 'Content-Type': 'application/json' } : {};
    const all = { ...defaults, ...(headers ?? {}) };
    return Object.keys(all).length ? new HttpHeaders(all) : undefined;
  }
}
