import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatsService } from '../../services/stats.service';
import { StatsResponse } from '../../models/types';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, MatCardModule, MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, MatToolbarModule, MatTooltipModule],
  template: `
    <mat-card class="card" style="margin-bottom:12px;padding:8px 12px;">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <mat-form-field appearance="fill">
          <mat-label>Window</mat-label>
          <mat-select [(ngModel)]="window" (selectionChange)="load()">
            <mat-option value="7d">Last 7 days</mat-option>
            <mat-option value="30d">Last 30 days</mat-option>
          </mat-select>
        </mat-form-field>
        <span class="spacer"></span>
        <button mat-icon-button color="primary" (click)="load()" aria-label="Refresh" matTooltip="Refresh">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>
    </mat-card>

    <div *ngIf="!totals; else contentTpl" style="display:flex;justify-content:center;padding:24px"><mat-spinner></mat-spinner></div>
    <ng-template #contentTpl>
      <div class="grid" style="display:grid;gap:12px;grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
        <mat-card class="mat-elevation-z2" style="padding:16px;display:flex;align-items:center;gap:12px;">
          <mat-icon style="color:#c62828">warning</mat-icon>
          <div>
            <div class="muted">Fraud ({{ window }})</div>
            <div style="font-size:22px;font-weight:700;">{{ totals.fraud_total }}</div>
          </div>
        </mat-card>
        <mat-card class="mat-elevation-z2" style="padding:16px;display:flex;align-items:center;gap:12px;">
          <mat-icon style="color:#2e7d32">verified_user</mat-icon>
          <div>
            <div class="muted">Clean ({{ window }})</div>
            <div style="font-size:22px;font-weight:700;">{{ totals.clean_total }}</div>
          </div>
        </mat-card>
        <mat-card class="mat-elevation-z2" style="padding:16px;display:flex;align-items:center;gap:12px;">
          <mat-icon style="color:#42a5f5">check_circle</mat-icon>
          <div>
            <div class="muted">Approved ({{ window }})</div>
            <div style="font-size:22px;font-weight:700;">{{ totals.approved_total || 0 }}</div>
          </div>
        </mat-card>
        <mat-card class="mat-elevation-z2" style="padding:16px;display:flex;align-items:center;gap:12px;">
          <mat-icon style="color:#ed6c02">hourglass_empty</mat-icon>
          <div>
            <div class="muted">Pending ({{ window }})</div>
            <div style="font-size:22px;font-weight:700;">{{ totals.pending_total || 0 }}</div>
          </div>
        </mat-card>
        <mat-card class="mat-elevation-z2" style="padding:16px;display:flex;align-items:center;gap:12px;">
          <mat-icon style="color:#9e9e9e">cancel</mat-icon>
          <div>
            <div class="muted">Rejected ({{ window }})</div>
            <div style="font-size:22px;font-weight:700;">{{ totals.rejected_total || 0 }}</div>
          </div>
        </mat-card>
      </div>

      <!-- Trends Chart -->
      <mat-card class="mat-elevation-z2" style="padding:16px; margin-top:12px;">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap; margin-bottom:8px;">
          <h3 style="margin:0;">Trends</h3>
          <span class="muted">Daily counts over {{ window }}</span>
          <span class="spacer"></span>
          <button mat-button (click)="toggle('fraud')" [color]="showFraud ? 'primary' : undefined">
            <mat-icon style="vertical-align:middle;margin-right:6px;color:#c62828">show_chart</mat-icon>
            Fraud
          </button>
          <button mat-button (click)="toggle('clean')" [color]="showClean ? 'primary' : undefined">
            <mat-icon style="vertical-align:middle;margin-right:6px;color:#2e7d32">show_chart</mat-icon>
            Clean
          </button>
        </div>
        <div style="width:100%; overflow:auto">
          <svg [attr.viewBox]="'0 0 ' + chartW + ' ' + chartH" preserveAspectRatio="none" style="width:100%;height:240px;background:transparent;border:1px solid var(--border);border-radius:8px;">
            <!-- axes -->
            <line x1="40" [attr.y1]="chartH-30" [attr.x2]="chartW-10" [attr.y2]="chartH-30" stroke="var(--border)"/>
            <line x1="40" y1="10" x2="40" [attr.y2]="chartH-30" stroke="var(--border)"/>
            <!-- paths -->
            <path *ngIf="showFraud" [attr.d]="fraudPath" fill="none" stroke="#c62828" stroke-width="2"/>
            <path *ngIf="showClean" [attr.d]="cleanPath" fill="none" stroke="#2e7d32" stroke-width="2"/>
          </svg>
        </div>
      </mat-card>
    </ng-template>
  `
})
export class DashboardComponent implements OnInit {
  private stats = inject(StatsService);
  totals: any;
  window: '7d' | '30d' = '7d';
  loading = false;
  timeseries: { ts: string; count_fraud: number; count_clean: number }[] = [];
  chartW = 800;
  chartH = 260;
  fraudPath = '';
  cleanPath = '';
  showFraud = true;
  showClean = true;

  ngOnInit() {
    this.load();
  }
  
  load() {
    this.loading = true;
    this.stats.getStats(this.window).subscribe({
      next: (r: StatsResponse) => {
        this.totals = r.totals;
        this.timeseries = r.timeseries || [];
        this.buildPaths();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private buildPaths() {
    if (!this.timeseries || this.timeseries.length === 0) {
      this.fraudPath = '';
      this.cleanPath = '';
      return;
    }
    const left = 40, right = this.chartW - 10, top = 10, bottom = this.chartH - 30;
    const n = this.timeseries.length;
    const maxVal = Math.max(
      ...this.timeseries.map(d => Math.max(d.count_fraud || 0, d.count_clean || 0)),
      1
    );
    const xStep = (right - left) / Math.max(n - 1, 1);
    const yScale = (v: number) => bottom - (v / maxVal) * (bottom - top);

    const build = (key: 'count_fraud'|'count_clean') => {
      return this.timeseries
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${left + i * xStep} ${yScale((d as any)[key] || 0)}`)
        .join(' ');
    };

    this.fraudPath = build('count_fraud');
    this.cleanPath = build('count_clean');
  }

  toggle(which: 'fraud'|'clean') {
    if (which === 'fraud') this.showFraud = !this.showFraud; else this.showClean = !this.showClean;
  }
}
