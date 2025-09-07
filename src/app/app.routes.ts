import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FlaggedComponent } from './pages/flagged/flagged.component';
import { IngestComponent } from './pages/ingest/ingest.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: FlaggedComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'flagged', component: FlaggedComponent, canActivate: [AuthGuard] },
  { path: 'ingest', component: IngestComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
