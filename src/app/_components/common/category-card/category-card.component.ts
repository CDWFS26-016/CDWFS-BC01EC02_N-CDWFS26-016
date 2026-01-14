import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../_models';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
  category = input.required<Category>();
  isSelected = input(false);
  clicked = output<Category>();

  onCardClick(): void {
    this.clicked.emit(this.category());
  }

  getImagePath(): string {
    // Si une image est définie dans les données, l'utiliser, sinon placeholder
    if (this.category().image) {
      return `/assets/img/categories/${this.category().image}`;
    }
    return '/assets/img/categories/placeholder.png';
  }
}
