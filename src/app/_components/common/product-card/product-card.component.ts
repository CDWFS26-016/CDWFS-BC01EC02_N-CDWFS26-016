import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../../_models';
import { CatalogService } from '../../../_services';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './product-card.component.html',
  styles: [],
})
export class ProductCardComponent {
  product = input.required<Product>();
  placeholderImage = input<string>('/assets/img/produits/placeholder.png');
  addToCartClicked = output<Product>();

  constructor(private catalogService: CatalogService) {}

  getProductSlug(): string {
    return this.catalogService.getProductSlug(this.product());
  }

  getCollectionName(): string {
    if (!this.product().collection) return '';
    const collection = this.catalogService.collections().find(c => c.id === this.product().collection);
    return collection?.titre || '';
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCartClicked.emit(this.product());
  }
}
