import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TransactionListItem } from '../models/types';

const API_BASE = environment.apiBase;

@Injectable({ providedIn: 'root' })
export class FraudService {
  constructor(private http: HttpClient) {}

  getFlagged(limit: number = 50) {
    return this.http.get<TransactionListItem[]>(`${API_BASE}/fraud/flagged?limit=${limit}`);
  }

  review(id: string, decision: 'APPROVED'|'REJECTED', notes: string = '') {
    return this.http.post(`${API_BASE}/fraud/review/${id}`, { decision, notes });
  }
}
