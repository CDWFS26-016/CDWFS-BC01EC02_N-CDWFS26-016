import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../_services';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './login-form.component.html',
  styles: [],
})
export class LoginFormComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  returnUrl = '/home';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    // Récupérer l'URL de retour depuis les paramètres de requête
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/home';
    });
  }

  async login(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.isLoading = false;
      return;
    }

    const response = await this.authService.login(this.email, this.password);

    if (response.success) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.errorMessage = response.message || 'Erreur de connexion';
      this.isLoading = false;
    }
  }
}
