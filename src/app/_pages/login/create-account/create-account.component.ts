import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent, FooterComponent } from '../../../_components';
import { AuthService } from '../../../_services';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, HeaderComponent, FooterComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {
  email = '';
  password = '';
  confirmPassword = '';
  nom = '';
  prenom = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  async register(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (!this.email || !this.password || !this.nom || !this.prenom) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.isLoading = false;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      this.isLoading = false;
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      this.isLoading = false;
      return;
    }

    const response = await this.authService.register(
      this.email,
      this.password,
      this.nom,
      this.prenom
    );

    if (response.success) {
      this.successMessage =
        'Compte créé avec succès! Redirection vers la connexion...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.errorMessage = response.message || 'Erreur lors de la création du compte';
    }

    this.isLoading = false;
  }
}
