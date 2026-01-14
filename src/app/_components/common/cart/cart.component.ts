import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../_services';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './cart.component.html',
  styles: []
})
export class CartComponent {
  displayMode = input<'header' | 'full-page'>('full-page');

  constructor(public cartService: CartService) {}

  updateQuantity(productId: string, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  incrementQuantity(productId: string): void {
    const cartItem = this.cartService.cartItems().find(item => item.product.reference_produit === productId);
    if (cartItem) {
      this.updateQuantity(productId, cartItem.quantity + 1);
    }
  }

  decrementQuantity(productId: string): void {
    const cartItem = this.cartService.cartItems().find(item => item.product.reference_produit === productId);
    if (cartItem && cartItem.quantity > 1) {
      this.updateQuantity(productId, cartItem.quantity - 1);
    }
  }
}
