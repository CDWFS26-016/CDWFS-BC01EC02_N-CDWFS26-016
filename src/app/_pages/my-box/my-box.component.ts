import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent, FooterComponent } from '../../_components';
import { authGuard } from '../../_services';

@Component({
  selector: 'app-my-box',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './my-box.component.html',
  styleUrl: './my-box.component.css'
})
export class MyBoxComponent {
  constructor() {}
}
