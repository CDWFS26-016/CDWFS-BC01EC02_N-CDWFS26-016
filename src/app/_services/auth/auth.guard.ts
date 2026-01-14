import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Logout et rediriger vers login si pas authentifié
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  };
}

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Logout et rediriger vers login avec l'URL de retour
  authService.logout();
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
