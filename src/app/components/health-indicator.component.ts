import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HealthService } from '../services/health.service';
import { interval, Subject, switchMap, takeUntil, catchError, of, map, startWith } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-health-indicator',
  imports: [CommonModule, MatTooltipModule],
  styles: [`
    .dot { width: 10px; height: 10px; border-radius: 50%; display:inline-block; margin-right:8px; }
    .ok { background:#2e7d32; }
    .warn { background:#ed6c02; }
    .err { background:#c62828; }
  `],
  template: `
    <span [matTooltip]="tooltip" matTooltipPosition="below">
      <span class="dot" [ngClass]="dotClass"></span>
    </span>
  `
})
export class HealthIndicatorComponent implements OnInit, OnDestroy {
  dotClass: 'ok' | 'warn' | 'err' = 'warn';
  tooltip = 'API health: checking...';
  private destroy$ = new Subject<void>();

  constructor(private health: HealthService) {}

  ngOnInit(): void {
    interval(15000)
      .pipe(
        startWith(0),
        switchMap(() => this.health.health().pipe(
          catchError(() => of({ status: 'down' } as any))
        )),
        switchMap((h: any) => this.health.ready().pipe(
          map((r: any) => ({ h: h?.status, r: r?.status })),
          catchError(() => of({ h: h?.status, r: 'not-ready' }))
        )),
        takeUntil(this.destroy$)
      )
      .subscribe(({ h, r }) => {
        if (h === 'ok' && r === 'ready') {
          this.dotClass = 'ok';
          this.tooltip = 'API health: ok, ready';
        } else if (h === 'ok') {
          this.dotClass = 'warn';
          this.tooltip = 'API health: ok, not ready';
        } else {
          this.dotClass = 'err';
          this.tooltip = 'API health: down';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
