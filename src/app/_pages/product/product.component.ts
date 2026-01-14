import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent, FooterComponent } from '../../_components';
import { CatalogService, CartService } from '../../_services';
import { Product } from '../../_models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MatIconModule, MatButtonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  product = signal<Product | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private cartService: CartService
  ) {
    // Watch for changes in the route params and reload product if needed
    effect(() => {
      const currentProduct = this.product();
      // This will automatically re-run when product signal changes
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productSlug = params.get('id');
      if (productSlug) {
        this.loadProduct(productSlug);
      } else {
        this.error.set('Produit introuvable');
        this.isLoading.set(false);
      }
    });
  }

  loadProduct(slug: string): void {
    this.isLoading.set(true);
    // Get the current products from the signal
    const foundProduct = this.catalogService.getProductBySlug(slug);
    
    if (foundProduct) {
      this.product.set(foundProduct);
      this.error.set(null);
      this.isLoading.set(false);
    } else {
      // Products might not be loaded yet, wait and retry
      setTimeout(() => this.loadProduct(slug), 500);
    }
  }

  addToCart(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.addToCart(currentProduct, 1);
      Swal.fire({
        title: 'Succès!',
        html: `<strong>${currentProduct.nom}</strong> a été ajouté au panier`,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/catalog']);
  }
}
