import { Component, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../_services';
import packageJson from '../../../../../package.json';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  templateUrl: './footer.component.html',
  styles: [],
})
export class FooterComponent {
  appName = packageJson.name;
  appVersion = packageJson.version;
  year = packageJson.year;
  isAdmin = false;

  readonly currentUser = computed(() => this.authService.currentUser());
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(private authService: AuthService, private router: Router) {
    // Vérifier si l'utilisateur est Admin (rôle id 1)
    effect(() => {
      const role = this.authService.currentRole();
      this.isAdmin = role?.id_role === 1;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
