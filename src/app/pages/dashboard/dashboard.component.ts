import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatsService } from '../../services/stats.service';
import { StatsResponse } from '../../models/types';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <div class="grid" style="display:grid;gap:12px;grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <mat-card *ngIf="totals; else loading">
        <h3>Totals (7d)</h3>
        <div>Fraud: {{ totals.fraud_total }}</div>
        <div>Clean: {{ totals.clean_total }}</div>
        <div>Pending: {{ totals.pending_total || 0 }}</div>
        <div>Approved: {{ totals.approved_total || 0 }}</div>
        <div>Rejected: {{ totals.rejected_total || 0 }}</div>
      </mat-card>
    </div>
    <ng-template #loading>
      <div style="display:flex;justify-content:center;padding:24px"><mat-spinner></mat-spinner></div>
    </ng-template>
  `
})
export class DashboardComponent implements OnInit {
  private stats = inject(StatsService);
  totals: any;

  ngOnInit() {
    this.stats.getStats('7d').subscribe((r: StatsResponse) => this.totals = r.totals);
  }
}
