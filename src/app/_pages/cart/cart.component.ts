import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent, FooterComponent, CartComponent as CartDisplayComponent } from '../../_components';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, HeaderComponent, FooterComponent, CartDisplayComponent],
  templateUrl: './cart.component.html',
  styles: [],
})
export class CartComponent {
  constructor() {}
}

