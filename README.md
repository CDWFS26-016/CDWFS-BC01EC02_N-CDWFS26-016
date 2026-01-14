# App partiel ng 20 tailwind 4 Sushi shop
# CDWFS BC01EC02_N°CDWFS26-016
# CDWFS26-016

Application Angular 20+ moderne avec authentification, Angular Material et architecture scalable.

## 🚀 Caractéristiques principales

- **Authentification factice** avec signals
- **Service API générique** avec HttpClient pour requêtes HTTP
- **Interface Angular Material minimale** cohérente et responsif
- **Barrel exports** pour imports simplifiés
- **Guards de route** pour protection des pages
- **LocalStorage utilities** type-safe
- **Gestion des rôles** (Admin, Gérant, Utilisateur)

## 📁 Structure du projet

```
src/app/
├── _components/         # Composants réutilisables
│   ├── layout/          # Header, Footer
│   └── common/          # Composants communs
├── _pages/              # Pages principales
│   ├── home/            # Accueil
│   └── login/           # Authentification
│       ├── login/
│       └── create-account/
├── _services/           # Services
│   ├── auth/            # Authentification
│   └── api/             # API générique
├── _models/             # Interfaces TypeScript
├── _utils/              # Utilitaires (localStorage)
├── _errors/             # Pages d'erreur
└── app.routes.ts        # Configuration des routes
```

## 🔐 Service d'Authentification

Le service d'authentification utilise **Angular Signals** pour gérer l'état de manière réactive.

### Caractéristiques

- ✅ Authentification factice (données depuis `data.json`)
- ✅ Enregistrement des nouveaux utilisateurs dans localStorage
- ✅ Hachage SHA-1 des mots de passe
- ✅ Rôles protégés (utilisateurs créés = rôle "Utilisateur" obligatoire)
- ✅ Persistance automatique lors du rechargement

### Utilisateurs de démo

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| jean@test.com | password | Admin |
| marie@test.com | password | Gérant |
| pierre@test.com | password | Utilisateur |

## 🌐 Service API Générique

Voir [APISERVICE.md](APISERVICE.md)

## 🎨 Composants Material Design

Tous les composants utilisent **Angular Material** pour une interface cohérente.

### Composants implémentés

- **Login** - Authentification avec spinner de chargement
- **Create Account** - Création de compte avec validation
- **Home** - Page d'accueil avec infos utilisateur
- **Header** - Barre de navigation avec menu utilisateur
- **Footer** - Affiche la version (admin seulement)
- **Error 404** - Page d'erreur

## 🛡️ Guards de route

Protection des routes avec authentification automatique.

```typescript
// Dans les routes
canActivate: [authGuard]

// Si non authentifié → redirection vers /login
// Si authentifié → accès accordé
```

## 🔑 Gestion des rôles

Trois rôles disponibles avec permissions différentes :

| Rôle | ID | Permissions |
|------|----|----|
| Admin | 1 | Tous les droits |
| Gérant | 2 | Créer, modifier, consulter |
| Utilisateur | 3 | Consulter seulement |

**Note** : Les utilisateurs créés ont automatiquement le rôle "Utilisateur" (id 3), même s'ils modifient le localStorage.

## 📦 Barrel Exports

Tous les dossiers utilisent des `index.ts` pour simplifier les imports.

```typescript
// Au lieu de :
import { AuthService } from './_services/auth/auth.service';

// Vous pouvez faire :
import { AuthService } from './_services';
```

## ⚙️ Démarrage

### Prérequis
- Node.js 18+
- Angular 20+

### Installation

```bash
npm install
```

### Développement

```bash
ng serve
```

Accédez à `http://localhost:4200/`

### Build

```bash
ng build
```

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
