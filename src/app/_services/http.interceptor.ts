import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Ajouter les headers par défaut
    const configuredRequest = this.addHeaders(request);

    return next.handle(configuredRequest).pipe(
      // Retry 2 fois en cas d'erreur (sauf 4xx et 5xx)
      retry({
        count: 2,
        delay: (error) => {
          // Ne pas retry les erreurs client/serveur
          if (error.status >= 400) {
            return throwError(() => error);
          }
          return throwError(() => error);
        },
      }),
      // Timeout après 30 secondes
      timeout(30000),
      // Gestion des erreurs
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  private addHeaders(request: HttpRequest<any>): HttpRequest<any> {
    // Ajouter Content-Type si absent
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Ajouter Authorization si token disponible
    const token = localStorage.getItem('authToken');
    if (token && !request.url.includes('login')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return request;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
      console.error('Erreur client:', error.error);
    } else {
      // Erreur côté serveur
      const message = error.error?.message || error.statusText;
      errorMessage = `Erreur ${error.status}: ${message}`;

      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de se connecter au serveur';
          break;
        case 400:
          errorMessage = `Requête invalide: ${message}`;
          break;
        case 401:
          errorMessage = 'Authentification requise';
          // Rediriger vers login si nécessaire
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur serveur interne';
          break;
        case 503:
          errorMessage = 'Service temporairement indisponible';
          break;
      }

      console.error('Erreur serveur:', error);
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      originalError: error,
    }));
  }
}
