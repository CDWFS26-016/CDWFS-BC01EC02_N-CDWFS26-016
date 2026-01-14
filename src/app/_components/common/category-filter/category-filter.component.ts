import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Category, Product, Collection } from '../../../_models';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatChipsModule,
    MatButtonModule
  ],
  templateUrl: './category-filter.component.html',
  styles: [],
})
export class CategoryFilterComponent {
  categories = input<Category[]>([]);
  collections = input<Collection[]>([]);
  allProducts = input<Product[]>([]);
  selectedPiecesFilter = input<number | null>(null);
  selectedCollectionFilter = input<number | null>(null);
  priceRange = input<[number, number]>([0, 100]);
  useLotPrice = input(true);
  selectedIngredients = input<string[]>([]);
  excludedAllergenes = input<string[]>([]);

  piecesFilterChanged = output<number | null>();
  collectionFilterChanged = output<number | null>();
  priceRangeChanged = output<[number, number]>();
  useLotPriceChanged = output<boolean>();
  ingredientToggled = output<string>();
  allergeneToggled = output<string>();
  filtersReset = output<void>();

  // Computed properties
  uniquePieces = computed(() => {
    const pieces = new Set<number>();
    this.allProducts().forEach(p => pieces.add(p.nombre_pieces));
    return Array.from(pieces).sort((a, b) => a - b);
  });

  allIngredients = computed(() => {
    const ingredients = new Set<string>();
    this.allProducts().forEach(p => {
      p.ingredients.forEach(ing => ingredients.add(ing));
    });
    return Array.from(ingredients).sort();
  });

  allAllergenes = computed(() => {
    const allergenes = new Set<string>();
    this.allProducts().forEach(p => {
      p.allergenes.forEach(allerg => allergenes.add(allerg));
    });
    return Array.from(allergenes).sort();
  });

  onPiecesChange(value: number | null): void {
    this.piecesFilterChanged.emit(value);
  }

  onCollectionChange(value: number | null): void {
    this.collectionFilterChanged.emit(value);
  }

  onPriceRangeChange(value: [number, number]): void {
    this.priceRangeChanged.emit(value);
  }

  onUseLotPriceChange(value: boolean): void {
    this.useLotPriceChanged.emit(value);
  }

  toggleIngredient(ingredient: string): void {
    this.ingredientToggled.emit(ingredient);
  }

  toggleAllergene(allergene: string): void {
    this.allergeneToggled.emit(allergene);
  }

  onIngredientsChange(ingredients: string[]): void {
    // Émettre les changements individuels pour chaque ingrédient
    const currentIngredients = new Set(this.selectedIngredients());
    const newIngredients = new Set(ingredients);
    
    // Ajouter les nouveaux
    newIngredients.forEach(ing => {
      if (!currentIngredients.has(ing)) {
        this.ingredientToggled.emit(ing);
      }
    });
    
    // Supprimer les anciens
    currentIngredients.forEach(ing => {
      if (!newIngredients.has(ing)) {
        this.ingredientToggled.emit(ing);
      }
    });
  }

  onAllergeneChange(allergenes: string[]): void {
    // Émettre les changements individuels pour chaque allergène
    const currentAllergenes = new Set(this.excludedAllergenes());
    const newAllergenes = new Set(allergenes);
    
    // Ajouter les nouveaux
    newAllergenes.forEach(allerg => {
      if (!currentAllergenes.has(allerg)) {
        this.allergeneToggled.emit(allerg);
      }
    });
    
    // Supprimer les anciens
    currentAllergenes.forEach(allerg => {
      if (!newAllergenes.has(allerg)) {
        this.allergeneToggled.emit(allerg);
      }
    });
  }

  resetAllFilters(): void {
    this.filtersReset.emit();
  }
}
