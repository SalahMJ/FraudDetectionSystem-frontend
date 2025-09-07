import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_BASE = environment.apiBase;

@Injectable({ providedIn: 'root' })
export class HealthService {
  constructor(private http: HttpClient) {}

  health() {
    return this.http.get<{ status: string }>(`${API_BASE}/health`);
  }

  ready() {
    return this.http.get<{ status: string }>(`${API_BASE}/ready`);
  }
}
