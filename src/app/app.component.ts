import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar>
      <span style="flex:1">Fraud Detection Dashboard</span>
      <a mat-button routerLink="/dashboard">Dashboard</a>
      <a mat-button routerLink="/flagged">Flagged</a>
      <button mat-raised-button color="primary" *ngIf="!auth.isAuthenticated()" routerLink="/login">Login</button>
      <button mat-button *ngIf="auth.isAuthenticated()" (click)="logout()">Logout</button>
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
