import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { Category } from '../../../_models';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, CategoryCardComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent {
  categories = input<Category[]>([]);
  selectedCategoryId = input<number | null>(null);
  categorySelected = output<number | null>();

  // Catégorie virtuelle "Tous"
  allCategory: Category = {
    id: 0,
    titre: 'Tous',
    description: 'Tous les produits'
  };

  onCategoryClick(category: Category | null): void {
    this.categorySelected.emit(category?.id || null);
  }

  onCardClick(category: Category): void {
    this.onCategoryClick(category);
  }
}
