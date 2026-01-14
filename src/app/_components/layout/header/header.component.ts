import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartComponent } from '../../common/cart/cart.component';
import { ConsumptionService, CartService } from '../../../_services';

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
    CartComponent,
  ],
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent {
  readonly consumptionMode = computed(() => this.consumptionService.consumptionMode());

  // Derived signals
  readonly consumptionLabel = computed(() => {
    const mode = this.consumptionMode();
    return mode === 'on-site' ? 'Sur place' : mode === 'takeaway' ? 'À emporter' : '';
  });

  constructor(
    private router: Router,
    private consumptionService: ConsumptionService,
    public cartService: CartService
  ) {}
}
