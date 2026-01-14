import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AuthService } from './auth.service';

describe('AuthService - Zoneless', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait avoir des méthodes login, register et logout', () => {
    expect(typeof service.login).toBe('function');
    expect(typeof service.register).toBe('function');
    expect(typeof service.logout).toBe('function');
  });

  it('devrait initialiser isAuthenticated à false', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('devrait initialiser currentUser à null', () => {
    expect(service.currentUser()).toBeNull();
  });

  it('devrait initialiser currentRole à null', () => {
    expect(service.currentRole()).toBeNull();
  });
});
