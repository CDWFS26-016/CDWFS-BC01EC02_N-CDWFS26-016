import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ApiService } from './api.service';

describe('ApiService - Zoneless', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait avoir une URL de base par défaut', () => {
    expect(service.getApiUrl()).toBe('http://localhost:3000/api');
  });

  it('devrait permettre de définir l\'URL de base', () => {
    const newUrl = 'https://api.example.com';
    service.setApiUrl(newUrl);
    expect(service.getApiUrl()).toBe(newUrl);
  });

  it('devrait avoir des méthodes HTTP (get, post, put, patch, delete)', () => {
    expect(typeof service.get).toBe('function');
    expect(typeof service.post).toBe('function');
    expect(typeof service.put).toBe('function');
    expect(typeof service.patch).toBe('function');
    expect(typeof service.delete).toBe('function');
  });
});
