import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './auth/auth.service';
import { HealthIndicatorComponent } from './components/health-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, HealthIndicatorComponent],
  template: `
    <mat-toolbar>
      <button mat-icon-button aria-label="Home" routerLink="/dashboard">
        <mat-icon>shield</mat-icon>
      </button>
      <span style="margin-left:8px;font-weight:600">Fraud Detection Dashboard</span>
      <span class="spacer"></span>
      <app-health-indicator></app-health-indicator>
      <a mat-button routerLink="/dashboard"><mat-icon style="margin-right:6px">dashboard</mat-icon>Dashboard</a>
      <a mat-button routerLink="/stats"><mat-icon style="margin-right:6px">insights</mat-icon>Stats</a>
      <a mat-button routerLink="/ingest"><mat-icon style="margin-right:6px">add_circle</mat-icon>Ingest</a>
      <button mat-raised-button color="primary" *ngIf="!auth.isAuthenticated()" routerLink="/login">
        <mat-icon style="margin-right:6px">login</mat-icon>
        Login
      </button>
      <button mat-button *ngIf="auth.isAuthenticated()" (click)="logout()">
        <mat-icon style="margin-right:6px">logout</mat-icon>
        Logout
      </button>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  auth = inject(AuthService);
  logout() { this.auth.logout(); }
}
