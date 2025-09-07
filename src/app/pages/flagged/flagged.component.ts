import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TransactionListItem } from '../../models/types';
import * as FlaggedSelectors from '../../store/flagged.selectors';
import * as FlaggedActions from '../../store/flagged.actions';
import { TransactionDetailDialogComponent } from './transaction-detail.dialog';

@Component({
  standalone: true,
  selector: 'app-flagged',
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule
  ],
  template: `
    <div class="card" style="margin-bottom:12px;display:flex;gap:12px;align-items:end;flex-wrap:wrap">
      <mat-form-field appearance="fill">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="statusFilter" (selectionChange)="scheduleReload()">
          <mat-option [value]="undefined">All</mat-option>
          <mat-option value="PENDING_REVIEW">Pending</mat-option>
          <mat-option value="APPROVED">Approved</mat-option>
          <mat-option value="REJECTED">Rejected</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Limit</mat-label>
        <input matInput type="number" [(ngModel)]="limit" (ngModelChange)="scheduleReload()" min="1" max="200">
      </mat-form-field>
      <span class="spacer"></span>
      <button mat-raised-button color="primary" (click)="reload()">
        <mat-icon style="margin-right:6px">refresh</mat-icon>
        Refresh
      </button>
    </div>
    <div class="table-wrap card">
      <h3>Flagged Transactions</h3>
      <div *ngIf="(loading$ | async)" style="display:flex;justify-content:center;padding:24px"><mat-spinner></mat-spinner></div>
      <table mat-table [dataSource]="(rows$ | async) ?? []" class="mat-elevation-z1">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let r"><a (click)="openDetail(r.id)" style="cursor:pointer">{{ r.id }}</a></td>
        </ng-container>
        <ng-container matColumnDef="user_id">
          <th mat-header-cell *matHeaderCellDef>User</th>
          <td mat-cell *matCellDef="let r">{{ r.user_id }}</td>
        </ng-container>
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef>Amount</th>
          <td mat-cell *matCellDef="let r">{{ r.amount }}</td>
        </ng-container>
        <ng-container matColumnDef="timestamp">
          <th mat-header-cell *matHeaderCellDef>Timestamp</th>
          <td mat-cell *matCellDef="let r">{{ r.timestamp }}</td>
        </ng-container>
        <ng-container matColumnDef="score">
          <th mat-header-cell *matHeaderCellDef>Score</th>
          <td mat-cell *matCellDef="let r">{{ r.score }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let r">
            <span class="status-chip" [ngClass]="{
              'status-pending': r.status === 'PENDING_REVIEW',
              'status-approved': r.status === 'APPROVED',
              'status-rejected': r.status === 'REJECTED'
            }">{{ r.status }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let r">
            <button mat-icon-button color="primary" (click)="review(r.id, 'APPROVED')" matTooltip="Approve" [disabled]="r.status !== 'PENDING_REVIEW'">
              <mat-icon>check_circle</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="review(r.id, 'REJECTED')" matTooltip="Reject" [disabled]="r.status !== 'PENDING_REVIEW'">
              <mat-icon>cancel</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>
    </div>
  `
})
export class FlaggedComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  rows$: Observable<TransactionListItem[]> = this.store.select(FlaggedSelectors.selectFlaggedItems);
  loading$: Observable<boolean> = this.store.select(FlaggedSelectors.selectFlaggedLoading);
  cols = ['id', 'user_id', 'amount', 'timestamp', 'score', 'status', 'actions'];
  statusFilter: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | undefined = undefined;
  limit = 50;
  private reloadTimer: any;

  ngOnInit() {
    this.reload();
  }

  review(id: string, decision: 'APPROVED' | 'REJECTED') {
    this.store.dispatch(FlaggedActions.reviewTransaction({ id, decision }));
  }

  reload() {
    this.store.dispatch(FlaggedActions.loadFlagged({ limit: this.limit, status: this.statusFilter }));
  }

  openDetail(id: string) {
    this.dialog.open(TransactionDetailDialogComponent, { data: { id }, width: '640px' });
  }

  scheduleReload() {
    clearTimeout(this.reloadTimer);
    this.reloadTimer = setTimeout(() => this.reload(), 300);
  }
}
