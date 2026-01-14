# 🌐 API HTTP - Documentation Complète

## Vue d'ensemble

Le système HTTP de l'application est composé de deux éléments :
1. **HttpConfigInterceptor** - Gestion globale des headers, erreurs et retry
2. **ApiService** - Interface générique et typée pour toutes les requêtes HTTP

Ces deux éléments travaillent ensemble pour fournir une solution HTTP robuste et centralisée.

---

## 🔧 HttpConfigInterceptor

### Enregistrement

L'intercepteur est automatiquement enregistré dans [app.config.ts](src/app/app.config.ts) :

```typescript
{
  provide: HTTP_INTERCEPTORS,
  useClass: HttpConfigInterceptor,
  multi: true,
}
```

### Fonctionnalités

#### 1. **Ajout automatique des headers**

L'intercepteur ajoute automatiquement à TOUTES les requêtes HTTP :

```typescript
// Headers appliqués automatiquement
Content-Type: application/json
Authorization: Bearer {token}  // Si token en localStorage
```

**Exemple :**
```typescript
// Requête originale
GET /users

// Après l'intercepteur
GET /users
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 2. **Retry automatique (2 tentatives)**

En cas d'erreur réseau :
- ✅ Réessaie 2 fois automatiquement
- ❌ Ne réessaie pas pour les erreurs HTTP (400, 401, 403, 500, etc.)

```typescript
// Exemple : Une requête qui échoue au timeout
GET /users (timeout)
  → Retry 1/2
GET /users (timeout)
  → Retry 2/2
GET /users (erreur réseau final)
  → Erreur propagée au composant
```

#### 3. **Timeout global (30 secondes)**

Chaque requête est automatiquement annulée après 30 secondes :

```typescript
timeout(30000)  // 30 secondes
```

#### 4. **Gestion centralisée des erreurs**

Les erreurs HTTP sont catchées et transformées en messages intelligibles :

```typescript
switch (error.status) {
  case 0:
    // Erreur réseau
    "Impossible de se connecter au serveur"
  
  case 400:
    // Requête invalide
    "Requête invalide: {message}"
  
  case 401:
    // Non authentifié
    "Authentification requise"
    // Optionnel: redirection vers login
  
  case 403:
    // Accès interdit
    "Accès refusé"
  
  case 404:
    // Ressource non trouvée
    "Ressource non trouvée"
  
  case 500:
    // Erreur serveur
    "Erreur serveur: {message}"
  
  case 503:
    // Service indisponible
    "Service indisponible, réessayez plus tard"
}
```

Tous les logs d'erreur sont aussi printés en console :
```typescript
console.error('Erreur client:', error);
console.error('Erreur serveur:', error);
```

### Flux complet d'une requête avec l'intercepteur

```
1. Composant appelle ApiService.get('/users')
   ↓
2. ApiService crée HttpRequest
   ↓
3. HttpConfigInterceptor.intercept() s'active
   ├─ Ajoute Content-Type: application/json
   ├─ Ajoute Authorization: Bearer {token}
   ↓
4. HttpClient envoie la requête au serveur
   ↓
5. En cas d'erreur réseau:
   ├─ Retry 1/2 ✓
   ├─ Retry 2/2 ✗ (échoue)
   ├─ Timeout détecté ✓
   ├─ Erreur formatée et loggée
   ↓
6. ApiService reçoit l'erreur et la propage
   ↓
7. Composant gère l'erreur dans le subscribe
```

---

## 🎯 ApiService

### Vue d'ensemble

Service générique et typé pour gérer tous les appels HTTP de l'application.

**Localisation :** [src/app/_services/api/api.service.ts](src/app/_services/api/api.service.ts)

### Configuration

#### Définir l'URL de base

Par défaut : `http://localhost:3000/api`

```typescript
constructor(private api: ApiService) {}

ngOnInit() {
  // Changer l'URL de base
  this.api.setApiUrl('https://api.example.com');
  
  // Récupérer l'URL actuelle
  const url = this.api.getApiUrl();
}
```

### Méthodes HTTP

#### **GET** - Récupérer une liste

```typescript
// Simple
getUsers() {
  return this.api.get<User[]>('/users');
}

// Dans le composant
this.api.get<User[]>('/users').subscribe({
  next: (users) => console.log(users),
  error: (err) => console.error(err),
});
```

#### **GET avec paramètres de requête**

```typescript
// Rechercher avec filtres
searchUsers(role: string, page: number) {
  return this.api.getWithParams<User[]>('/users', {
    role,
    page,
    limit: 10,
  });
}

// URL finale : /users?role=admin&page=1&limit=10
```

#### **GET par ID**

```typescript
// Récupérer une ressource spécifique
getUser(userId: number) {
  return this.api.getById<User>('/users', userId);
}

// URL finale : /users/123
```

#### **POST** - Créer

```typescript
createUser(userData: CreateUserDto) {
  return this.api.post<User>('/users', userData);
}

// Utilisation
this.api.post<User>('/users', {
  name: 'Jean',
  email: 'jean@example.com',
}).subscribe(
  (newUser) => console.log('Créé:', newUser)
);
```

#### **PUT** - Remplacer complètement

```typescript
// Remplacer une ressource entière
updateUser(userId: number, updatedUser: User) {
  return this.api.put<User>('/users', userId, updatedUser);
}

// URL finale : /users/123
```

#### **PATCH** - Mise à jour partielle

```typescript
// Mettre à jour seulement quelques champs
patchUser(userId: number, changes: Partial<User>) {
  return this.api.patch<User>('/users', userId, changes);
}

// Utilisation
this.api.patch<User>('/users', 123, {
  email: 'newemail@example.com',
  // Les autres champs ne sont pas touchés
}).subscribe(
  (updated) => console.log('Mis à jour:', updated)
);
```

#### **DELETE** - Supprimer

```typescript
// Supprimer une ressource
deleteUser(userId: number) {
  return this.api.delete<void>('/users', userId);
}

// URL finale : /users/123
```

#### **DELETE sans ID** - Supprimer avec body

```typescript
// Supprimer en utilisant le body (cas particulier)
deleteUsers(userIds: number[]) {
  return this.api.deleteWithoutId<void>('/users', { ids: userIds });
}
```

---

## 🔒 Authentification automatique

### Bearer Token

L'intercepteur ajoute automatiquement le Bearer token à toutes les requêtes (sauf login) :

```typescript
// 1. Après authentification, stocker le token
localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIs...');

// 2. À partir de là, toutes les requêtes incluent le token
this.api.get<User[]>('/users');
// Cela envoie :
// GET /users
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// 3. Pour la déconnexion
localStorage.removeItem('authToken');
// Les requêtes suivantes n'auront plus le token
```

### Exclusions

Le header `Authorization` n'est PAS ajouté pour :
- Les requêtes vers `/login` (endpoints d'auth)
- Les requêtes qui ont déjà un header Authorization

---

## 📊 Exemples complets

### Exemple 1 : Récupérer une liste d'utilisateurs avec filtrage

```typescript
import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/_services';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-users',
  template: `
    <div *ngIf="loading">Chargement...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <ul>
      <li *ngFor="let user of users">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  `,
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadUsers('admin');
  }

  loadUsers(role: string) {
    this.loading = true;
    this.error = null;

    this.api.getWithParams<User[]>('/users', { role }).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement';
        this.loading = false;
      },
    });
  }
}
```

### Exemple 2 : Créer et mettre à jour

```typescript
@Component({
  selector: 'app-user-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="user.name" placeholder="Nom" />
      <input [(ngModel)]="user.email" placeholder="Email" />
      <button type="submit">{{ isEdit ? 'Mettre à jour' : 'Créer' }}</button>
    </form>
  `,
})
export class UserFormComponent {
  user: Partial<User> = {};
  isEdit = false;

  constructor(private api: ApiService) {}

  onSubmit() {
    if (this.isEdit) {
      // Mettre à jour
      this.api.patch<User>('/users', this.user.id!, this.user).subscribe({
        next: () => console.log('Utilisateur mis à jour'),
        error: (err) => console.error(err),
      });
    } else {
      // Créer
      this.api.post<User>('/users', this.user).subscribe({
        next: (newUser) => console.log('Utilisateur créé:', newUser),
        error: (err) => console.error(err),
      });
    }
  }
}
```

### Exemple 3 : Gestion des erreurs

```typescript
this.api.get<User[]>('/users').subscribe({
  next: (users) => {
    console.log('Succès:', users);
  },
  error: (error) => {
    // L'erreur est déjà formatée par l'intercepteur
    if (error.status === 401) {
      // Rediriger vers login
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      // Afficher message d'accès refusé
      this.showAccessDenied();
    } else {
      // Afficher erreur générique
      this.showError(error.message);
    }
  },
});
```

---

## 🧪 Tests unitaires

Les tests de l'API Service utilisent `provideHttpClientTesting()` :

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should fetch users', () => {
    const service = TestBed.inject(ApiService);
    // Tester les appels HTTP
  });
});
```

---

## ⚠️ Bonnes pratiques

### 1. Toujours typer les réponses

```typescript
// ✅ Bon
this.api.get<User[]>('/users')

// ❌ Mauvais
this.api.get('/users')  // Type any
```

### 2. Gérer les erreurs

```typescript
// ✅ Bon
this.api.get<User[]>('/users').subscribe({
  next: (users) => { /* ... */ },
  error: (err) => { /* ... */ }
});

// ❌ Mauvais
this.api.get<User[]>('/users').subscribe(users => { /* ... */ });
```

### 3. Utiliser les opérateurs RxJS pour transformer les données

```typescript
// ✅ Bon
import { map } from 'rxjs/operators';

this.api.get<User[]>('/users').pipe(
  map(users => users.filter(u => u.role === 'admin'))
).subscribe(admins => { /* ... */ });
```

### 4. Éviter les appels API multiples

```typescript
// ❌ Mauvais - appelle l'API chaque fois
getNombreFois() {
  this.api.get<User[]>('/users').subscribe(users => {
    this.processUsers(users);
  });
}

// ✅ Bon - appelle une seule fois
ngOnInit() {
  this.api.get<User[]>('/users').subscribe(users => {
    this.cachedUsers = users;
  });
}
```

---

## 🔄 Intégration avec le reste de l'app

### AuthService
```typescript
// AuthService utilise ApiService en interne
constructor(private api: ApiService) {}

login(email: string, password: string) {
  return this.api.post('/auth/login', { email, password });
}
```

### Components
```typescript
// Les composants utilisent ApiService directement
constructor(private api: ApiService) {}

getUsers() {
  this.api.get<User[]>('/users').subscribe(/* ... */);
}
```

---

## 📚 Fichiers concernés

- [app.config.ts](src/app/app.config.ts) - Enregistrement de l'intercepteur
- [http.interceptor.ts](src/app/_services/http.interceptor.ts) - Implémentation de l'intercepteur
- [api.service.ts](src/app/_services/api/api.service.ts) - Service API générique
- Tests :
  - [auth.service.spec.ts](src/app/_services/auth/auth.service.spec.ts)
  - [api.service.spec.ts](src/app/_services/api/api.service.spec.ts)

---

## 🚀 Résumé

| Fonctionnalité | HttpConfigInterceptor | ApiService |
|---|---|---|
| Headers automatiques | ✅ | - |
| Retry automatique | ✅ | - |
| Timeout global | ✅ | - |
| Gestion d'erreurs | ✅ | ✅ (logging) |
| Interface typée | - | ✅ |
| GET/POST/PUT/PATCH/DELETE | - | ✅ |
| Bearer token | ✅ | - |

**Ensemble, ils fournissent une solution HTTP complète, robuste et maintenable.** ✨
