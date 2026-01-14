import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginFormComponent } from '../../common';
import { CartComponent } from '../../common/cart/cart.component';
import { AuthService, ConsumptionService, CartService } from '../../../_services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    LoginFormComponent,
    CartComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly currentUser = computed(() => this.authService.currentUser());
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly consumptionMode = computed(() => this.consumptionService.consumptionMode());

  // Derived signals
  readonly isLoginPage = computed(() => this.router.url.startsWith('/login'));
  readonly consumptionLabel = computed(() => {
    const mode = this.consumptionMode();
    return mode === 'on-site' ? 'Sur place' : mode === 'takeaway' ? 'À emporter' : '';
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private consumptionService: ConsumptionService,
    public cartService: CartService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
