import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TransactionListItem } from '../../models/types';
import * as FlaggedSelectors from '../../store/flagged.selectors';
import * as FlaggedActions from '../../store/flagged.actions';

@Component({
  standalone: true,
  selector: 'app-flagged',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="table-wrap card">
      <h3>Flagged Transactions</h3>
      <div *ngIf="(loading$ | async)" style="display:flex;justify-content:center;padding:24px"><mat-spinner></mat-spinner></div>
      <table mat-table [dataSource]="(rows$ | async) ?? []" class="mat-elevation-z1">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let r">{{ r.id }}</td>
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
          <td mat-cell *matCellDef="let r">{{ r.status }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let r">
            <button mat-button color="primary" (click)="review(r.id, 'APPROVED')">Approve</button>
            <button mat-button color="warn" (click)="review(r.id, 'REJECTED')">Reject</button>
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
  rows$: Observable<TransactionListItem[]> = this.store.select(FlaggedSelectors.selectFlaggedItems);
  loading$: Observable<boolean> = this.store.select(FlaggedSelectors.selectFlaggedLoading);
  cols = ['id', 'user_id', 'amount', 'timestamp', 'score', 'status', 'actions'];

  ngOnInit() {
    this.store.dispatch(FlaggedActions.loadFlagged({ limit: 50 }));
  }

  review(id: string, decision: 'APPROVED' | 'REJECTED') {
    this.store.dispatch(FlaggedActions.reviewTransaction({ id, decision }));
  }
}
