import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TransactionsService } from '../../services/transactions.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  standalone: true,
  selector: 'app-ingest',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule],
  template: `
    <mat-card class="card" style="max-width:720px;margin:16px auto;">
      <h2>Ingest Transaction</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <mat-form-field appearance="fill">
          <mat-label>Transaction ID</mat-label>
          <input matInput formControlName="transaction_id" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>User ID</mat-label>
          <input matInput formControlName="user_id" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Amount</mat-label>
          <input matInput type="number" formControlName="amount" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Currency</mat-label>
          <input matInput formControlName="currency" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Merchant ID</mat-label>
          <input matInput formControlName="merchant_id" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Category</mat-label>
          <input matInput formControlName="merchant_category" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Time (HH:MM)</mat-label>
          <input matInput type="time" formControlName="time" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Channel</mat-label>
          <input matInput formControlName="channel" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>IP</mat-label>
          <input matInput formControlName="ip" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Device ID</mat-label>
          <input matInput formControlName="device_id">
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Latitude</mat-label>
          <input matInput type="number" step="any" formControlName="lat">
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Longitude</mat-label>
          <input matInput type="number" step="any" formControlName="lon">
        </mat-form-field>
        <div style="grid-column: 1 / -1; display:flex; gap:12px; align-items:center; justify-content:space-between; margin-top:8px;">
          <div style="display:flex; gap:12px; align-items:center;">
            <mat-slide-toggle formControlName="useUtc">Use UTC</mat-slide-toggle>
            <button mat-stroked-button type="button" (click)="setNowOffset(0)">Now</button>
            <button mat-stroked-button type="button" (click)="setNowOffset(5)">+5m</button>
            <button mat-stroked-button type="button" (click)="setNowOffset(60)">+1h</button>
          </div>
          <div>
            <button mat-button type="button" (click)="form.reset()">Clear</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || submitting">Submit</button>
          </div>
        </div>
      </form>
    </mat-card>
  `
})
export class IngestComponent {
  private fb = inject(FormBuilder);
  private svc = inject(TransactionsService);
  private snack = inject(MatSnackBar);
  submitting = false;

  form = this.fb.group({
    transaction_id: ['', Validators.required],
    user_id: ['', Validators.required],
    amount: [0, Validators.required],
    currency: ['USD', Validators.required],
    merchant_id: ['', Validators.required],
    merchant_category: ['', Validators.required],
    date: [new Date(), Validators.required],
    time: [this.defaultTime(), Validators.required],
    channel: ['WEB', Validators.required],
    ip: ['', [Validators.required, Validators.pattern(/^(?:\d{1,3}\.){3}\d{1,3}$/)]],
    device_id: [''],
    lat: [null],
    lon: [null],
    useUtc: [true]
  });

  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const v = this.form.value as any;
    const isoTs = this.combineToISO(v.date, v.time, !!v.useUtc);
    const payload = {
      transaction_id: v.transaction_id,
      user_id: v.user_id,
      amount: Number(v.amount),
      currency: v.currency,
      merchant_id: v.merchant_id,
      merchant_category: v.merchant_category,
      timestamp: isoTs,
      channel: v.channel,
      ip: v.ip,
      device_id: v.device_id || undefined,
      geo: (v.lat != null || v.lon != null) ? { lat: v.lat, lon: v.lon } : undefined
    };
    this.svc.postTransaction(payload).subscribe({
      next: () => { this.snack.open('Transaction enqueued', 'OK', { duration: 2500 }); this.submitting = false; },
      error: () => { this.snack.open('Failed to enqueue', 'Dismiss', { duration: 3000 }); this.submitting = false; }
    });
  }

  private defaultTime(): string {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private combineToISO(dateVal: any, timeVal: string, useUtc: boolean): string {
    const d = new Date(dateVal);
    const [hh, mm] = (timeVal || '00:00').split(':').map((x: string) => parseInt(x, 10));
    if (useUtc) {
      // set as UTC fields
      d.setUTCHours(hh || 0, mm || 0, 0, 0);
      return d.toISOString();
    } else {
      d.setHours(hh || 0, mm || 0, 0, 0);
      return d.toISOString();
    }
  }

  setNowOffset(minutes: number) {
    const useUtc = !!this.form.get('useUtc')?.value;
    const base = new Date();
    const target = new Date(base.getTime() + minutes * 60 * 1000);
    // Update date control
    this.form.get('date')?.setValue(new Date(target));
    // Update time control respecting toggle
    const hh = useUtc ? String(target.getUTCHours()).padStart(2, '0') : String(target.getHours()).padStart(2, '0');
    const mm = useUtc ? String(target.getUTCMinutes()).padStart(2, '0') : String(target.getMinutes()).padStart(2, '0');
    this.form.get('time')?.setValue(`${hh}:${mm}`);
  }
}
