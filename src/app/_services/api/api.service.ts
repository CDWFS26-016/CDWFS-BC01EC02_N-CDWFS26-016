import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  status: number;
  message: string;
  originalError?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // À adapter

  constructor(private http: HttpClient) {}

  /**
   * GET request
   * @param endpoint Chemin de l'endpoint (ex: '/users')
   * @returns Observable de la réponse
   */
  get<T>(endpoint: string): Observable<T> {
    // Si c'est un chemin local (commence par /assets), ne pas ajouter le préfixe API
    const url = endpoint.startsWith('/assets') ? endpoint : `${this.apiUrl}${endpoint}`;
    return this.http.get<T>(url).pipe(
      catchError((error) => {
        console.error(`GET ${endpoint} failed:`, error);
        throw error;
      })
    );
  }

  /**
   * GET request avec paramètres
   * @param endpoint Chemin de l'endpoint
   * @param params Paramètres de requête
   * @returns Observable de la réponse
   */
  getWithParams<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params }).pipe(
      catchError((error) => {
        console.error(`GET ${endpoint} with params failed:`, error);
        throw error;
      })
    );
  }

  /**
   * GET request par ID
   * @param endpoint Chemin de l'endpoint
   * @param id Identifiant de la ressource
   * @returns Observable de la réponse
   */
  getById<T>(endpoint: string, id: string | number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}/${id}`).pipe(
      catchError((error) => {
        console.error(`GET ${endpoint}/${id} failed:`, error);
        throw error;
      })
    );
  }

  /**
   * POST request
   * @param endpoint Chemin de l'endpoint
   * @param body Corps de la requête
   * @returns Observable de la réponse
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body).pipe(
      catchError((error) => {
        console.error(`POST ${endpoint} failed:`, error);
        throw error;
      })
    );
  }

  /**
   * PUT request (remplace complètement la ressource)
   * @param endpoint Chemin de l'endpoint
   * @param id Identifiant de la ressource
   * @param body Corps de la requête
   * @returns Observable de la réponse
   */
  put<T>(endpoint: string, id: string | number, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}/${id}`, body).pipe(
      catchError((error) => {
        console.error(`PUT ${endpoint}/${id} failed:`, error);
        throw error;
      })
    );
  }

  /**
   * PATCH request (met à jour partiellement la ressource)
   * @param endpoint Chemin de l'endpoint
   * @param id Identifiant de la ressource
   * @param body Corps de la requête
   * @returns Observable de la réponse
   */
  patch<T>(endpoint: string, id: string | number, body: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${endpoint}/${id}`, body).pipe(
      catchError((error) => {
        console.error(`PATCH ${endpoint}/${id} failed:`, error);
        throw error;
      })
    );
  }

  /**
   * DELETE request
   * @param endpoint Chemin de l'endpoint
   * @param id Identifiant de la ressource
   * @returns Observable de la réponse
   */
  delete<T>(endpoint: string, id: string | number): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}/${id}`).pipe(
      catchError((error) => {
        console.error(`DELETE ${endpoint}/${id} failed:`, error);
        throw error;
      })
    );
  }

  /**
   * DELETE request sans ID
   * @param endpoint Chemin de l'endpoint complet
   * @returns Observable de la réponse
   */
  deleteWithoutId<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`).pipe(
      catchError((error) => {
        console.error(`DELETE ${endpoint} failed:`, error);
        throw error;
      })
    );
  }

  /**
   * Définir l'URL de base de l'API
   * @param url URL de base
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  /**
   * Obtenir l'URL de base actuelle
   * @returns URL de base
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}
