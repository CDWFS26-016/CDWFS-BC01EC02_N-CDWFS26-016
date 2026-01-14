import { Injectable } from '@angular/core';
import { Signal, signal, computed } from '@angular/core';
import { CartItem, Product } from '../../_models';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSignal = signal<CartItem[]>(this.loadCartFromStorage());
  readonly cartItems: Signal<CartItem[]> = this.cartItemsSignal.asReadonly();

  // Discount for authenticated users
  readonly AUTHENTICATED_DISCOUNT = 0.02; // 2%

  // Computed properties
  readonly cartCount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  readonly cartTotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.product.prix_lot * item.quantity), 0)
  );

  readonly cartTotalAfterDiscount = computed(() => {
    const total = this.cartTotal();
    if (this.isAuthenticated()) {
      return total * (1 - this.AUTHENTICATED_DISCOUNT);
    }
    return total;
  });

  readonly discountAmount = computed(() => {
    if (this.isAuthenticated()) {
      return this.cartTotal() * this.AUTHENTICATED_DISCOUNT;
    }
    return 0;
  });

  readonly isEmpty = computed(() => this.cartItems().length === 0);

  constructor(private authService: AuthService) {
    // Sauvegarder le panier chaque fois qu'il change
    this.saveCartToStorage();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSignal();
    const existingItem = currentItems.find(item => item.product.reference_produit === product.reference_produit);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartItemsSignal.set([...currentItems]);
    } else {
      this.cartItemsSignal.set([...currentItems, { product, quantity }]);
    }
    this.saveCartToStorage();
  }

  removeFromCart(productId: string): void {
    const filtered = this.cartItemsSignal().filter(
      item => item.product.reference_produit !== productId
    );
    this.cartItemsSignal.set(filtered);
    this.saveCartToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.cartItemsSignal();
    const item = items.find(i => i.product.reference_produit === productId);
    if (item) {
      item.quantity = quantity;
      this.cartItemsSignal.set([...items]);
      this.saveCartToStorage();
    }
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
    localStorage.removeItem('cart');
  }

  private saveCartToStorage(): void {
    const items = this.cartItems();
    const cartData = items.map(item => ({
      reference_produit: item.product.reference_produit,
      quantity: item.quantity,
      product: item.product
    }));
    localStorage.setItem('cart', JSON.stringify(cartData));
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem('cart');
      if (!stored) return [];
      
      const cartData = JSON.parse(stored);
      return cartData.map((item: any) => ({
        product: item.product,
        quantity: item.quantity
      }));
    } catch {
      return [];
    }
  }
}
