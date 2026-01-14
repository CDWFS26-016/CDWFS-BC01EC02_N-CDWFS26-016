import { Injectable } from '@angular/core';
import { Signal, signal } from '@angular/core';
import { ApiService } from '../api';
import { Product, Category, Collection } from '../../_models';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private productsSignal = signal<Product[]>([]);
  private categoriesSignal = signal<Category[]>([]);
  private collectionsSignal = signal<Collection[]>([]);

  readonly products: Signal<Product[]> = this.productsSignal.asReadonly();
  readonly categories: Signal<Category[]> = this.categoriesSignal.asReadonly();
  readonly collections: Signal<Collection[]> = this.collectionsSignal.asReadonly();

  constructor(private apiService: ApiService) {
    this.loadData();
  }

  private loadData(): void {
    this.apiService.get<Product[]>('/assets/data/produits.json').subscribe(products => {
      this.productsSignal.set(products);
    });

    this.apiService.get<Category[]>('/assets/data/categories.json').subscribe(categories => {
      this.categoriesSignal.set(categories);
    });

    this.apiService.get<Collection[]>('/assets/data/collections.json').subscribe(collections => {
      this.collectionsSignal.set(collections);
    });
  }

  /**
   * Extrait le slug du produit à partir du champ url
   * Ex: /fr/livraison/umami/maki-shiitake-4037 -> maki-shiitake-4037
   */
  getProductSlug(product: Product): string {
    if (!product.url) {
      return product.reference_produit;
    }
    return product.url.split('/').pop() || product.reference_produit;
  }

  /**
   * Trouve un produit par son slug
   */
  getProductBySlug(slug: string): Product | undefined {
    return this.products().find(p => this.getProductSlug(p) === slug);
  }
}
