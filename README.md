# App partiel ng 20 tailwind 4 Sushi shop
# CDWFS BC01EC02_N°CDWFS26-016
# CDWFS26-016

Application Angular 20+ moderne avec authentification, Angular Material, Tailwind CSS 4 et architecture scalable.

## 🚀 Caractéristiques principales

- **Authentification factice** avec signals dans le footer
- **Service API générique** avec HttpClient pour requêtes HTTP
- **Interface Angular Material** avec Tailwind CSS 4
- **Système de navigation par icônes** au footer avec Material Icons
- **Animations et transitions fluides** avec Tailwind et CSS personnalisées
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
│   ├── catalog/         # Catalogue avec filtres
│   ├── product/         # Détail produit amélioré
│   ├── cart/            # Panier
│   ├── login/           # Authentification
│   │   ├── login/
│   │   └── create-account/
│   ├── logout/
├── _services/           # Services
│   ├── auth/            # Authentification (rôles)
│   ├── api/             # API générique
│   ├── cart/            # Gestion panier
│   ├── catalog/         # Catalogue produits
│   └── consumption/     # Mode consommation
├── _models/             # Interfaces TypeScript
├── _utils/              # Utilitaires (localStorage)
├── _errors/             # Pages d'erreur
├── styles.css           # Styles globaux
└── app.routes.ts        # Configuration des routes
```

## 🎨 Système de Design Tailwind CSS 4

### Tailwind CSS 4 - Intégration complète

L'application utilise **Tailwind CSS 4** de manière complète avec classes inline dans les templates HTML.

#### Imports et configuration

- Import via `@import "tailwindcss"` dans le fichier global `styles.css`
- Configuration centralisée dans `tailwind.config.js`
- PostCSS configuré avec le plugin tailwindcss standard
- Content glob scanning pour tous les fichiers HTML et TypeScript

### Schéma de couleurs

- **Primary** : #6366f1 (Indigo)
- **Secondary** : #8b5cf6 (Purple)
- **Accent** : #ec4899 (Pink)
- **Dégradés** : combinaisons de couleurs primaires et secondaires
- **Backgrounds** : dégradés subtils (from-slate-50 via-white to-blue-50)

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

## 🛠️ Composants principales

### Header (Layout)

**Responsabilité** : Navigation supérieure et accès rapide au panier

- Affichage du logo centré
- Indicateur du mode consommation (Sur place / À emporter)
- Bouton du panier avec badge compteur
- Menu déroulant du panier depuis le header
- Barre sticky au top avec z-index 50

### Footer (Layout)

**Responsabilité** : Navigation principale et authentification

Navigation par **4 icônes Material** :
1. **Catalogue** (restaurant_menu) → Accès à la liste des produits
2. **Login/Compte** (login/account_circle) → Selon l'état d'authentification
3. **Accueil** (home) → Retour à la page d'accueil
4. **Infos app** → Affiche version (admin uniquement)

**Gestion de l'authentification** :
- Si non connecté : icône login menant à `/login`
- Si connecté : icône compte avec menu déroulant
  - Affichage du nom et prénom
  - Bouton déconnexion

Tooltip sur chaque icône, hover effects (scale-110), barre sticky en bas (z-40).

### Pages principales

#### Home

#### Catalog
- Système de filtres
- Sélection par catégories (barre horizontale scrollable)
- Grille de produits responsive (1 à 4 colonnes selon la résolution)
- Cartes produits avec hover effects (shadow-2xl, scale-105, translate-y)

#### Product (Détail)
- Affichage image produit
- Section prix
- Informations détaillées (ingrédients, allergènes)
- Bouton d'ajout au panier

#### Cart (Panier)
- Vue complète du panier en page
- Liste des articles avec quantités
- Calcul du total et remise authentifiés
- Bouton de commande

#### Login & Create Account
- Formulaires avec Material Design
- Messages d'erreur/succès avec icônes et borders
- Liens vers pages complémentaires

### Composants communs

#### Product Card
- Carte avec image avec zoom effet au survol
- Badge prix
- Bouton FAB pour ajouter au panier

#### Category Card
- Affichage circulaire avec image

#### Categories List
- Barre horizontale scrollable

#### Login Form
- Champs email et mot de passe avec Material Form Field
- Messages d'erreur avec icônes Material
- Spinner de chargement

#### Cart Component
- Affichable en deux modes : header (compact) et full-page (détaillé)
- Liste des articles avec prix
- Calcul automatique du total

## 📊 Service Panier (Cart Service)

**Gestion complète du panier** avec :
- Ajout/suppression d'articles
- Calcul du total
- Remise 2% pour utilisateurs authentifiés
- Persistent dans sessionStorage
- Signals pour mises à jour automatiques

## 📊 Service Catalogue (Catalog Service)

**Gestion des produits** :
- Récupération depuis "l'API" locale
- Filtrage par catégorie
- Filtrage par prix
- Filtrage par ingrédients et allergènes
- Recherche par nombre de pièces

## 🎯 Service Mode Consommation (Consumption Service)

**Gestion du mode de consommation** :
- Sur place / À emporter
- Persistance en sessionStorage
- Signals pour mise à jour globale

## 🌐 Service API Générique (HttpInterceptor)

Voir [API-HTTP-DOC.md](API-HTTP-DOC.md)

## 🛡️ Guards de route

Protection des routes avec authentification automatique :

- **authGuard** : vérifie l'authentification
- **Redirection automatique** : vers `/login` si non authentifié
- **Gestion des rôles** : contrôle d'accès par rôle utilisateur

## 🔑 Gestion des rôles

Trois rôles disponibles avec permissions différentes :

| Rôle | ID | Description |
|------|----|----|
| Admin | 1 | Tous les droits |
| Gérant | 2 | Gestion des contenus |
| Utilisateur | 3 | Accès client standard |
(non fonctionnel)

**Note** : Les utilisateurs créés manuellement ont automatiquement le rôle "Utilisateur" (id 3).

## 📦 Barrel Exports

Tous les dossiers utilisent des `index.ts` pour simplifier les imports.

Les composants, services et modèles sont réexportés au niveau des dossiers parent pour éviter les imports profonds.

## ⚙️ Configuration

### PostCSS Configuration

Configuration standard avec :
- Plugin tailwindcss
- Plugin autoprefixer

Pas de dépendance `@tailwindcss/postcss` (non supportée en Angular 20).

### Tailwind Configuration

- **Content glob** : scan des fichiers HTML et TypeScript
- **Theme extend** : couleurs personnalisées (primary, secondary, accent)
- **Pas de @apply** : classes inline dans les templates

### Styles Globaux

Fichier `styles.css` contenant :
- Import Angular Material theme
- Import Tailwind CSS 4
- Animations personnalisées
- Scrollbar custom styling
- Transitions globales
- Classes utilitaires personnalisées

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- Angular 20+
- npm ou yarn

### Installation

```bash
npm install
```

### Développement

```bash
ng serve
```

Accédez à `http://localhost:4200/` (ou port spécifié)

### Développement custom port

```bash
ng serve
```

### Build Production

```bash
ng build
```

### Build avec configuration spécifique

```bash
ng build --configuration development
```

## 🎯 Points clés de l'architecture

1. **Composants standalone**
2. **Signals Angular**
3. **Material Design**
4. **Tailwind CSS 4**
5. **Services centralisés**
6. **Barrel exports** : imports simplifiés
7. **Type-safety** : TypeScript strict dans tous les services

## 📚 Documentation supplémentaire

- [API HTTP Documentation](API-HTTP-DOC.md)
- [GitHub Repository](github-link.txt)
