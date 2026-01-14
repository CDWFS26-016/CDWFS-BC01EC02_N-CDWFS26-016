export interface User {
  id_user: number;
  nom_user: string;
  prenom_user: string;
  login_user: string;
  mdp_user: string;
  id_role_user: number;
}

export interface Role {
  id_role: number;
  nom_role: string;
  droits: {
    nav: number;
    create: number;
    update: number;
    delete: number;
    admin: number;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  role?: Role;
  message?: string;
}
