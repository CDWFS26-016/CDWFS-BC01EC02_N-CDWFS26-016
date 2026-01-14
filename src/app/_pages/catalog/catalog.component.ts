import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent, FooterComponent, CategoryFilterComponent, CategoriesListComponent, ProductCardComponent } from '../../_components';
import { CatalogService, CartService } from '../../_services';
import { Product } from '../../_models';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CategoryFilterComponent,
    CategoriesListComponent,
    ProductCardComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './catalog.component.html',
  styles: [],
})
export class CatalogComponent {
  // Signal pour afficher/masquer les filtres
  showFilters = signal(false);

  // Signals pour les filtres
  selectedCategoryId = signal<number | null>(null);
  selectedPiecesFilter = signal<number | null>(null);
  selectedCollectionFilter = signal<number | null>(null);
  priceRange = signal<[number, number]>([0, 30]);
  useLotPrice = signal(true);
  selectedIngredients = signal<string[]>([]);
  excludedAllergenes = signal<string[]>([]);

  // Données du service
  categories = computed(() => this.catalogService.categories());
  collections = computed(() => this.catalogService.collections());
  allProducts = computed(() => this.catalogService.products());

  // Produits filtrés
  filteredProducts = computed(() => {
    let products = this.allProducts();
    const categoryId = this.selectedCategoryId();
    const piecesFilter = this.selectedPiecesFilter();
    const collectionFilter = this.selectedCollectionFilter();
    const [minPrice, maxPrice] = this.priceRange();
    const useLot = this.useLotPrice();
    const ingredients = this.selectedIngredients();
    const allergenes = this.excludedAllergenes();

    // Filtre catégorie
    if (categoryId !== null) {
      products = products.filter(p => p.categorie === categoryId);
    }

    // Filtre nombre de pièces
    if (piecesFilter !== null) {
      products = products.filter(p => p.nombre_pieces === piecesFilter);
    }

    // Filtre collection
    if (collectionFilter !== null) {
      products = products.filter(p => p.collection === collectionFilter);
    }

    // Filtre prix
    products = products.filter(p => {
      const price = useLot ? p.prix_lot : p.prix_unitaire;
      return price >= minPrice && price <= maxPrice;
    });

    // Filtre ingrédients (au moins un doit être présent)
    if (ingredients.length > 0) {
      products = products.filter(p =>
        ingredients.some(ing => p.ingredients.includes(ing))
      );
    }

    // Filtre allergènes (aucun ne doit être présent)
    if (allergenes.length > 0) {
      products = products.filter(p =>
        !allergenes.some(allerg => p.allergenes.includes(allerg))
      );
    }

    return products;
  });

  // Catégorie sélectionnée
  selectedCategory = computed(() => {
    const id = this.selectedCategoryId();
    if (id === null) return null;
    return this.categories().find(c => c.id === id);
  });

  // Extraire tous les ingrédients uniques
  allIngredients = computed(() => {
    const ingredients = new Set<string>();
    this.allProducts().forEach(p => {
      p.ingredients.forEach(ing => ingredients.add(ing));
    });
    return Array.from(ingredients).sort();
  });

  // Extraire tous les allergènes uniques
  allAllergenes = computed(() => {
    const allergenes = new Set<string>();
    this.allProducts().forEach(p => {
      p.allergenes.forEach(allerg => allergenes.add(allerg));
    });
    return Array.from(allergenes).sort();
  });

  // Extraire tous les nombres de pièces uniques
  uniquePieces = computed(() => {
    const pieces = new Set<number>();
    this.allProducts().forEach(p => pieces.add(p.nombre_pieces));
    return Array.from(pieces).sort((a, b) => a - b);
  });

  constructor(
    private catalogService: CatalogService,
    private cartService: CartService
  ) {}

  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  toggleIngredient(ingredient: string): void {
    const current = this.selectedIngredients();
    if (current.includes(ingredient)) {
      this.selectedIngredients.set(current.filter(i => i !== ingredient));
    } else {
      this.selectedIngredients.set([...current, ingredient]);
    }
  }

  toggleAllergene(allergene: string): void {
    const current = this.excludedAllergenes();
    if (current.includes(allergene)) {
      this.excludedAllergenes.set(current.filter(a => a !== allergene));
    } else {
      this.excludedAllergenes.set([...current, allergene]);
    }
  }

  resetFilters(): void {
    this.selectedCategoryId.set(null);
    this.selectedPiecesFilter.set(null);
    this.selectedCollectionFilter.set(null);
    this.priceRange.set([0, 30]);
    this.useLotPrice.set(true);
    this.selectedIngredients.set([]);
    this.excludedAllergenes.set([]);
  }

  getCategoryName(categoryId: number): string {
    return this.categories().find(c => c.id === categoryId)?.titre || '';
  }

  getCollectionName(collectionId: number | null): string {
    if (collectionId === null) return '';
    return this.collections().find(c => c.id === collectionId)?.titre || '';
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    Swal.fire({
      title: 'Succès!',
      html: `<strong>${product.nom}</strong> a été ajouté au panier`,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
}
