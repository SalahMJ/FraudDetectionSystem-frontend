export type TransactionStatus = 'PENDING_REVIEW'|'APPROVED'|'REJECTED';

export interface TransactionListItem {
  id: string;
  user_id: string;
  amount?: number;
  currency?: string;
  merchant_id?: string;
  merchant_category?: string;
  timestamp?: string;
  score?: number;
  status: TransactionStatus;
}

export interface StatsResponse {
  timeseries: {
    ts: string;
    count_fraud: number;
    count_clean: number;
    count_approved?: number;
    count_pending?: number;
    count_rejected?: number;
  }[];
  totals: { fraud_total: number; clean_total: number; pending_total?: number; approved_total?: number; rejected_total?: number };
}

// Backend-aligned models
export interface TransactionDetail {
  id: string;
  user_id: string;
  amount?: number;
  currency?: string;
  merchant_id?: string;
  merchant_category?: string;
  timestamp?: string;
  channel?: string;
  ip?: string;
  lat?: number;
  lon?: number;
  device_id?: string;
  score?: number;
  is_fraud?: boolean;
  status: TransactionStatus;
}

export interface Geo {
  lat?: number;
  lon?: number;
}

export interface TransactionIn {
  transaction_id: string;
  user_id: string;
  amount: number;
  currency: string;
  merchant_id: string;
  merchant_category: string;
  timestamp: string; // ISO datetime
  channel: string;
  ip: string;
  geo?: Geo;
  device_id?: string;
}

export interface EnqueueResponse {
  enqueued: boolean;
  id: string;
}
