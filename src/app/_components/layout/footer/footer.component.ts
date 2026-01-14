import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../_services';
import packageJson from '../../../../../package.json';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  appName = packageJson.name;
  appVersion = packageJson.version;
  year = packageJson.year;
  isAdmin = false;

  constructor(private authService: AuthService) {
    // Vérifier si l'utilisateur est Admin (rôle id 1)
    effect(() => {
      const role = this.authService.currentRole();
      this.isAdmin = role?.id_role === 1;
    });
  }
}
