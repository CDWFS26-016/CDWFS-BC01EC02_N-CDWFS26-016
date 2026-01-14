import { Routes } from '@angular/router';

export const loginRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'create-account',
    loadComponent: () => import('./create-account/create-account.component').then((m) => m.CreateAccountComponent),
  },
];
