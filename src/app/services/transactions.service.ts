import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EnqueueResponse, TransactionIn } from '../models/types';

const API_BASE = environment.apiBase;

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  constructor(private http: HttpClient) {}

  postTransaction(body: TransactionIn) {
    return this.http.post<EnqueueResponse>(`${API_BASE}/transactions`, body);
  }
}
