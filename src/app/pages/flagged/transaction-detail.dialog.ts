import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FraudService } from '../../services/fraud.service';
import { TransactionDetail } from '../../models/types';

@Component({
  standalone: true,
  selector: 'app-transaction-detail-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title style="display:flex;align-items:center;gap:8px">
      <mat-icon>receipt_long</mat-icon>
      Transaction Detail
    </h2>
    <div mat-dialog-content>
      <div *ngIf="loading" style="display:flex;justify-content:center;padding:24px"><mat-spinner></mat-spinner></div>
      <div *ngIf="!loading && detail" class="card">
        <div style="display:grid;grid-template-columns: 1fr 1fr; gap: 12px;">
          <div><strong>ID</strong><div>{{ detail.id }}</div></div>
          <div><strong>User</strong><div>{{ detail.user_id }}</div></div>
          <div><strong>Amount</strong><div>{{ detail.amount }} {{ detail.currency }}</div></div>
          <div><strong>Timestamp</strong><div>{{ detail.timestamp }}</div></div>
          <div><strong>Channel</strong><div>{{ detail.channel }}</div></div>
          <div><strong>IP</strong><div>{{ detail.ip }}</div></div>
          <div><strong>Geo</strong><div>{{ detail.lat }}, {{ detail.lon }}</div></div>
          <div><strong>Device</strong><div>{{ detail.device_id }}</div></div>
          <div><strong>Score</strong><div>{{ detail.score }}</div></div>
          <div><strong>Status</strong>
            <div>
              <span class="status-chip" [ngClass]="{
                'status-pending': detail.status === 'PENDING_REVIEW',
                'status-approved': detail.status === 'APPROVED',
                'status-rejected': detail.status === 'REJECTED'
              }">{{ detail.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        <mat-icon style="margin-right:6px">close</mat-icon>
        Close
      </button>
    </div>
  `
})
export class TransactionDetailDialogComponent implements OnInit {
  detail?: TransactionDetail;
  loading = true;

  constructor(
    private svc: FraudService,
    private dialogRef: MatDialogRef<TransactionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  ngOnInit(): void {
    this.svc.getDetail(this.data.id).subscribe({
      next: (d) => { this.detail = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
