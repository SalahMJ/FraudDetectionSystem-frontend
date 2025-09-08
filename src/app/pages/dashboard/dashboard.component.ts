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
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { StatsService } from '../../services/stats.service';
import { StatsResponse } from '../../models/types';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, MatCardModule, MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, MatToolbarModule, MatTooltipModule, MatChipsModule, MatDividerModule],
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
          <button mat-button (click)="toggle('approved')" [color]="showApproved ? 'primary' : undefined">
            <mat-icon style="vertical-align:middle;margin-right:6px;color:#42a5f5">show_chart</mat-icon>
            Approved
          </button>
          <button mat-button (click)="toggle('pending')" [color]="showPending ? 'primary' : undefined">
            <mat-icon style="vertical-align:middle;margin-right:6px;color:#ed6c02">show_chart</mat-icon>
            Pending
          </button>
          <button mat-button (click)="toggle('rejected')" [color]="showRejected ? 'primary' : undefined">
            <mat-icon style="vertical-align:middle;margin-right:6px;color:#9e9e9e">show_chart</mat-icon>
            Rejected
          </button>
        </div>
        <div style="width:100%; overflow:auto">
          <svg [attr.viewBox]="'0 0 ' + chartW + ' ' + chartH" preserveAspectRatio="none" style="width:100%;height:280px;background:transparent;border:1px solid var(--border);border-radius:8px;">
            <!-- background -->
            <rect x="1" y="1" [attr.width]="chartW-2" [attr.height]="chartH-2" rx="8" ry="8" fill="rgba(255,255,255,0.03)" />
            <!-- axes -->
            <line x1="40" [attr.y1]="chartH-40" [attr.x2]="chartW-10" [attr.y2]="chartH-40" stroke="var(--border)"/>
            <line x1="40" y1="10" x2="40" [attr.y2]="chartH-40" stroke="var(--border)"/>
            <!-- grid and ticks -->
            <g *ngFor="let t of yTicks">
              <line x1="40" [attr.y1]="t.y" [attr.x2]="chartW-10" [attr.y2]="t.y" stroke="rgba(255,255,255,0.05)"/>
              <text x="34" [attr.y]="t.y+4" text-anchor="end" style="font-size:10px; fill: var(--muted)">{{ t.value }}</text>
            </g>
            <!-- x labels -->
            <g *ngFor="let xl of xLabels">
              <text [attr.x]="xl.x" [attr.y]="chartH-24" text-anchor="middle" style="font-size:10px; fill: var(--muted)">{{ xl.label }}</text>
            </g>
            <!-- paths -->
            <path *ngIf="showFraud" [attr.d]="fraudPath" fill="none" stroke="#c62828" stroke-width="2"/>
            <path *ngIf="showClean" [attr.d]="cleanPath" fill="none" stroke="#2e7d32" stroke-width="2"/>
            <path *ngIf="showApproved" [attr.d]="approvedPath" fill="none" stroke="#42a5f5" stroke-width="2"/>
            <path *ngIf="showPending" [attr.d]="pendingPath" fill="none" stroke="#ed6c02" stroke-width="2"/>
            <path *ngIf="showRejected" [attr.d]="rejectedPath" fill="none" stroke="#9e9e9e" stroke-width="2"/>
          </svg>
        </div>
      </mat-card>

      <!-- AI Insights -->
      <mat-card class="mat-elevation-z2" style="padding:16px; margin-top:12px;">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap; margin-bottom:8px;">
          <h3 style="margin:0;">AI Insights</h3>
          <span class="muted">Powered by AI</span>
        </div>
        <div style="display:flex; gap:12px; align-items:flex-start; flex-wrap:wrap;">
          <mat-form-field style="flex:1; min-width:320px;" appearance="fill">
            <mat-label>Ask a question about these stats</mat-label>
            <textarea matInput rows="3" [(ngModel)]="prompt" placeholder="e.g., Summarize anomalies and recommend what to track next" 
              style="background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:8px; padding:8px;"></textarea>
          </mat-form-field>
          <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
            <button mat-raised-button color="primary" (click)="askAI()" [disabled]="aiLoading || !prompt">
              <mat-icon style="margin-right:6px">auto_awesome</mat-icon>
              Ask AI
            </button>
            <div class="muted" style="font-size:12px">Uses current window ({{ window }})</div>
          </div>
        </div>
        <div style="margin:8px 0; display:flex; gap:8px; flex-wrap:wrap;">
          <mat-chip-row (click)="usePrompt('Summarize the stats and highlight anomalies')" selectable>
            <mat-icon matChipAvatar>lightbulb</mat-icon>
            Summarize
          </mat-chip-row>
          <mat-chip-row (click)="usePrompt('Recommend which KPIs to monitor based on these stats')" selectable>
            <mat-icon matChipAvatar>insights</mat-icon>
            KPIs to monitor
          </mat-chip-row>
          <mat-chip-row (click)="usePrompt('Create a bar chart comparing daily fraud vs clean counts')" selectable>
            <mat-icon matChipAvatar>bar_chart</mat-icon>
            Bar chart: fraud vs clean
          </mat-chip-row>
        </div>
        <mat-divider></mat-divider>
        <div *ngIf="aiLoading" style="display:flex;justify-content:center;padding:12px"><mat-spinner diameter="28"></mat-spinner></div>
        <div *ngIf="aiInsight && !aiLoading" class="card" style="margin-top:12px;padding:12px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;"><mat-icon>chat</mat-icon><strong>Insight</strong></div>
          <div style="white-space:pre-wrap;line-height:1.4">{{ aiInsight }}</div>
          <div style="display:flex;justify-content:flex-end;margin-top:8px;">
            <button mat-stroked-button (click)="copy(aiInsight)"><mat-icon style="margin-right:6px">content_copy</mat-icon>Copy</button>
          </div>
        </div>
        <div *ngIf="aiChartSpec && !aiLoading" class="card" style="margin-top:12px;padding:12px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <mat-icon>integration_instructions</mat-icon><strong>Chart Spec (JSON)</strong>
            <span class="spacer"></span>
            <button mat-stroked-button (click)="copySpec()"><mat-icon style="margin-right:6px">content_copy</mat-icon>Copy Spec</button>
          </div>
          <pre style="white-space:pre-wrap;overflow:auto;max-height:340px;margin-top:8px" class="muted">{{ aiChartSpec | json }}</pre>
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
  approvedPath = '';
  pendingPath = '';
  rejectedPath = '';
  showFraud = true;
  showClean = true;
  showApproved = true;
  showPending = false;
  showRejected = false;
  yTicks: { value: number; y: number }[] = [];
  xLabels: { label: string; x: number }[] = [];
  prompt = '';
  aiLoading = false;
  aiInsight: string | null = null;
  aiChartSpec: any = null;

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
    const left = 40, right = this.chartW - 10, top = 10, bottom = this.chartH - 40;
    const n = this.timeseries.length;
    const valuesMax = this.timeseries.map(d => Math.max(
      d.count_fraud || 0,
      d.count_clean || 0,
      (d as any).count_approved || 0,
      (d as any).count_pending || 0,
      (d as any).count_rejected || 0,
    ));
    const maxVal = Math.max(...valuesMax, 1);
    const xStep = (right - left) / Math.max(n - 1, 1);
    const yScale = (v: number) => bottom - (v / maxVal) * (bottom - top);

    const build = (key: 'count_fraud'|'count_clean') => {
      return this.timeseries
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${left + i * xStep} ${yScale((d as any)[key] || 0)}`)
        .join(' ');
    };
    const buildAny = (key: string) => this.timeseries
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${left + i * xStep} ${yScale((d as any)[key] || 0)}`)
      .join(' ');

    this.fraudPath = build('count_fraud');
    this.cleanPath = build('count_clean');
    this.approvedPath = buildAny('count_approved');
    this.pendingPath = buildAny('count_pending');
    this.rejectedPath = buildAny('count_rejected');

    // y ticks (5 steps)
    const steps = 5;
    this.yTicks = Array.from({ length: steps + 1 }, (_, i) => {
      const v = Math.round((maxVal / steps) * i);
      return { value: v, y: yScale(v) };
    });

    // x labels: first, middle, last (avoid overlap)
    const formatDate = (iso: string) => (iso || '').slice(0, 10);
    this.xLabels = [];
    if (n >= 1) this.xLabels.push({ label: formatDate(this.timeseries[0].ts), x: left });
    if (n >= 3) this.xLabels.push({ label: formatDate(this.timeseries[Math.floor(n/2)].ts), x: left + Math.floor(n/2) * xStep });
    if (n >= 2) this.xLabels.push({ label: formatDate(this.timeseries[n-1].ts), x: left + (n-1) * xStep });
  }

  toggle(which: 'fraud'|'clean'|'approved'|'pending'|'rejected') {
    if (which === 'fraud') this.showFraud = !this.showFraud;
    else if (which === 'clean') this.showClean = !this.showClean;
    else if (which === 'approved') this.showApproved = !this.showApproved;
    else if (which === 'pending') this.showPending = !this.showPending;
    else if (which === 'rejected') this.showRejected = !this.showRejected;
  }

  askAI() {
    if (!this.prompt) return;
    this.aiLoading = true;
    this.aiInsight = null;
    this.aiChartSpec = null;
    this.stats.getAIInsights(this.prompt, this.window).subscribe({
      next: (res) => {
        this.aiInsight = this.cleanInsight(res?.insight || '') || null;
        this.aiChartSpec = this.parseSpec(res?.chartSpec);
        this.aiLoading = false;
      },
      error: () => { this.aiLoading = false; }
    });
  }

  private cleanInsight(text: string): string {
    if (!text) return text;
    // remove ```json fences if present
    return text.replace(/```json[\s\S]*?\n|```/gi, '').trim();
  }

  usePrompt(text: string) { this.prompt = text; }

  copy(val: string) {
    if (!val) return;
    navigator.clipboard?.writeText(val).catch(() => {});
  }

  copySpec() {
    if (!this.aiChartSpec) return;
    const txt = typeof this.aiChartSpec === 'string' ? this.aiChartSpec : JSON.stringify(this.aiChartSpec, null, 2);
    this.copy(txt);
  }

  private parseSpec(spec: any): any {
    if (!spec) return null;
    if (typeof spec === 'object') return spec;
    if (typeof spec === 'string') {
      // strip fenced code if present
      const m = spec.match(/```json\s*([\s\S]*?)\s*```/i);
      const s = m ? m[1] : spec;
      try { return JSON.parse(s); } catch { return spec; }
    }
    return spec;
  }
}
