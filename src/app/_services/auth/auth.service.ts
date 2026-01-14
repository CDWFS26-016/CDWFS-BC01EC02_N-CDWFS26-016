import { Injectable, signal, computed } from '@angular/core';
import { User, Role, AuthResponse } from '../../_models';
import { LocalStorageUtil } from '../../_utils';
import authData from '../../../../public/assets/data/auth.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private currentRoleSignal = signal<Role | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Computed signals pour accéder l'état
  currentUser = this.currentUserSignal.asReadonly();
  currentRole = this.currentRoleSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  private users: User[] = [];
  private roles: Role[] = [];

  constructor() {
    this.loadData();
    this.checkLocalStorage();
  }

  private loadData(): void {
    // Charger les données depuis data.json
    this.users = [...(authData.users as User[])];
    this.roles = authData.roles as Role[];

    // Charger aussi les utilisateurs créés et sauvegardés dans le localStorage
    const registeredUsers = LocalStorageUtil.getItem<User[]>('registeredUsers');
    if (registeredUsers && Array.isArray(registeredUsers)) {
      // Ajouter les utilisateurs du localStorage s'ils ne sont pas déjà présents
      const existingIds = new Set(this.users.map(u => u.id_user));
      const newUsers = registeredUsers.filter(u => !existingIds.has(u.id_user));
      this.users = [...this.users, ...newUsers];
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const hashedPassword = await this.hashPassword(password);
    const user = this.users.find(
      u => u.login_user === email && u.mdp_user === hashedPassword
    );

    if (user) {
      // Forcer le rôle à "Utilisateur" (id 3) si c'est un utilisateur créé
      let roleId = user.id_role_user;
      if (this.isRegisteredUser(user.id_user)) {
        roleId = 3;
      }
      
      const role = this.roles.find(r => r.id_role === roleId);
      this.currentUserSignal.set(user);
      this.currentRoleSignal.set(role || null);
      this.isAuthenticatedSignal.set(true);
      LocalStorageUtil.setItem('currentUser', user);
      LocalStorageUtil.setItem('currentRole', role);
      return { success: true, user, role };
    }

    return { success: false, message: 'Email ou mot de passe incorrect' };
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.currentRoleSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    LocalStorageUtil.removeItem('currentUser');
    LocalStorageUtil.removeItem('currentRole');
  }

  async register(email: string, password: string, nom: string, prenom: string): Promise<AuthResponse> {
    const userExists = this.users.some(u => u.login_user === email);

    if (userExists) {
      return { success: false, message: 'Cet email est déjà utilisé' };
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser: User = {
      id_user: Math.max(...this.users.map(u => u.id_user), 0) + 1,
      nom_user: nom,
      prenom_user: prenom,
      login_user: email,
      mdp_user: hashedPassword,
      id_role_user: 3 // Utilisateur par défaut
    };

    this.users.push(newUser);

    // Sauvegarder les utilisateurs créés dans le localStorage
    const registeredUsers = LocalStorageUtil.getItem<User[]>('registeredUsers') || [];
    registeredUsers.push(newUser);
    LocalStorageUtil.setItem('registeredUsers', registeredUsers);

    const role = this.roles.find(r => r.id_role === 3);
    return { success: true, user: newUser, role };
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  getCurrentRole(): Role | null {
    // Vérifier si l'utilisateur actuel est un utilisateur créé
    // Si c'est le cas, forcer son rôle à "Utilisateur" (id 3)
    const user = this.currentUserSignal();
    if (user && this.isRegisteredUser(user.id_user)) {
      return this.roles.find(r => r.id_role === 3) || null;
    }
    return this.currentRoleSignal();
  }

  private isRegisteredUser(userId: number): boolean {
    const registeredUsers = LocalStorageUtil.getItem<User[]>('registeredUsers') || [];
    return registeredUsers.some(u => u.id_user === userId);
  }

  private checkLocalStorage(): void {
    const user = LocalStorageUtil.getItem<User>('currentUser');
    if (user) {
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
      
      // Forcer le rôle à "Utilisateur" (id 3) si c'est un utilisateur créé
      if (this.isRegisteredUser(user.id_user)) {
        const userRole = this.roles.find(r => r.id_role === 3);
        this.currentRoleSignal.set(userRole || null);
      } else {
        const role = LocalStorageUtil.getItem<Role>('currentRole');
        if (role) {
          this.currentRoleSignal.set(role);
        }
      }
    }
  }

  private async hashPassword(password: string): Promise<string> {
    // Note: Dans une app réelle, utiliser bcrypt côté serveur
    // Ici on utilise SHA-1 (pas sécurisé, juste pour la démo)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
