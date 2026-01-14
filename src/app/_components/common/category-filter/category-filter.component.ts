import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
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
  styleUrl: './category-filter.component.css'
})
export class CategoryFilterComponent {
  @Input() categories: Category[] = [];
  @Input() collections: Collection[] = [];
  @Input() allProducts: Product[] = [];
  @Input() selectedPiecesFilter: number | null = null;
  @Input() selectedCollectionFilter: number | null = null;
  @Input() priceRange: [number, number] = [0, 100];
  @Input() useLotPrice = true;
  @Input() selectedIngredients: string[] = [];
  @Input() excludedAllergenes: string[] = [];

  @Output() piecesFilterChanged = new EventEmitter<number | null>();
  @Output() collectionFilterChanged = new EventEmitter<number | null>();
  @Output() priceRangeChanged = new EventEmitter<[number, number]>();
  @Output() useLotPriceChanged = new EventEmitter<boolean>();
  @Output() ingredientToggled = new EventEmitter<string>();
  @Output() allergeneToggled = new EventEmitter<string>();
  @Output() filtersReset = new EventEmitter<void>();

  // Computed properties
  uniquePieces = computed(() => {
    const pieces = new Set<number>();
    this.allProducts.forEach(p => pieces.add(p.nombre_pieces));
    return Array.from(pieces).sort((a, b) => a - b);
  });

  allIngredients = computed(() => {
    const ingredients = new Set<string>();
    this.allProducts.forEach(p => {
      p.ingredients.forEach(ing => ingredients.add(ing));
    });
    return Array.from(ingredients).sort();
  });

  allAllergenes = computed(() => {
    const allergenes = new Set<string>();
    this.allProducts.forEach(p => {
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
    const currentIngredients = new Set(this.selectedIngredients);
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
    const currentAllergenes = new Set(this.excludedAllergenes);
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
