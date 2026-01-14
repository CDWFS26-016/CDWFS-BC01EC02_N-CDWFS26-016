import { Routes } from '@angular/router';
import { authGuard } from './_services';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./_pages/login/login.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'home',
    loadComponent: () => import('./_pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'catalog',
    loadComponent: () => import('./_pages/catalog/catalog.component').then((m) => m.CatalogComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./_pages/product/product.component').then((m) => m.ProductComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./_pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'logout',
    loadComponent: () => import('./_pages/logout/logout.component').then((m) => m.LogoutComponent),
    canActivate: [authGuard],
  },
  {
    path: '404',
    loadComponent: () => import('./_errors/error404/error404.component').then((m) => m.Error404),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];
