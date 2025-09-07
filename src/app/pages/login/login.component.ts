import { Component, inject } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../../store/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../store/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [NgIf, AsyncPipe, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="card" style="max-width:420px;margin:40px auto;">
      <h2>Login</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" required>
        </mat-form-field>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>
        <div *ngIf="(error$ | async) as err" style="color:#c62828;margin-bottom:8px">{{ err }}</div>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || (loading$ | async)">Login</button>
      </form>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loading$: Observable<boolean> = this.store.select(selectAuthLoading);
  error$: Observable<string | null | undefined> = this.store.select(selectAuthError);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value as any;
    this.store.dispatch(AuthActions.login({ username, password }));
  }
}
