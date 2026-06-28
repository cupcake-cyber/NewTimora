import { Routes } from '@angular/router';

import { AppComponent } from './pages/app/app';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { CompaniesComponent } from './pages/companies/companies';

import { LoginComponent } from './pages/login/login';
import { authGuard } from './guards/auth';
import { guestGuard } from './guards/guest';

export const routes: Routes = [

  { path: '', redirectTo: 'app', pathMatch: 'full' },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },

  {
    path: 'app',
    component: AppComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'companies', component: CompaniesComponent },

      // default dentro de /app
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },

  { path: '**', redirectTo: 'app' },
];