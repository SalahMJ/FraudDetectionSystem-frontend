import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TransactionListItem, TransactionDetail } from '../models/types';

const API_BASE = environment.apiBase;

@Injectable({ providedIn: 'root' })
export class FraudService {
  constructor(private http: HttpClient) {}

  getFlagged(limit: number = 50, status?: 'PENDING_REVIEW'|'APPROVED'|'REJECTED') {
    let url = `${API_BASE}/fraud/flagged?limit=${limit}`;
    if (status) url += `&status=${status}`;
    return this.http.get<TransactionListItem[]>(url);
  }

  review(id: string, decision: 'APPROVED'|'REJECTED', notes: string = '') {
    return this.http.post(`${API_BASE}/fraud/review/${id}`, { decision, notes });
  }

  getDetail(id: string) {
    return this.http.get<TransactionDetail>(`${API_BASE}/fraud/tx/${id}`);
  }
}
