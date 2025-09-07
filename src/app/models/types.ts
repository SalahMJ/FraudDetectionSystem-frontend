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
  timeseries: { ts: string; count_fraud: number; count_clean: number }[];
  totals: { fraud_total: number; clean_total: number; pending_total?: number; approved_total?: number; rejected_total?: number };
}
