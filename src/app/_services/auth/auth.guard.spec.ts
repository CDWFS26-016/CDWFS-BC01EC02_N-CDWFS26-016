import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, runInInjectionContext, Injector } from '@angular/core';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard - Zoneless', () => {
  let router: Router;
  let authService: AuthService;
  let injector: Injector;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    });

    injector = TestBed.inject(Injector);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/home' } as RouterStateSnapshot;

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('devrait rediriger vers login si non authentifié', () => {
    const result = runInInjectionContext(injector, () => authGuard(mockRoute, mockState));
    expect(result).toBe(false);
  });

  it('devrait appeler logout avant redirection', () => {
    spyOn(authService, 'logout');
    runInInjectionContext(injector, () => authGuard(mockRoute, mockState));
    expect(authService.logout).toHaveBeenCalled();
  });

  it('devrait inclure l\'URL de retour en query params', () => {
    runInInjectionContext(injector, () => authGuard(mockRoute, mockState));
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/home' },
    });
  });
});
