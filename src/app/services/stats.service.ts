import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StatsResponse } from '../models/types';

const API_BASE = environment.apiBase;

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private http: HttpClient) {}

  getStats(window: string = '7d') {
    return this.http.get<StatsResponse>(`${API_BASE}/fraud/stats?window=${window}`);
  }

  getAIInsights(prompt: string, window: string = '7d') {
    return this.http.post<{ window: string; insight: string; chartSpec?: any }>(
      `${API_BASE}/fraud/stats/ai`,
      { prompt, window }
    );
  }
}
