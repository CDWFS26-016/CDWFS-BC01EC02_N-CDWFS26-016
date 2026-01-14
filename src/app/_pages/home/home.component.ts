import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent, FooterComponent } from '../../_components';
import { ConsumptionService } from '../../_services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, HeaderComponent],
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent {
  constructor(private consumptionService: ConsumptionService, private router: Router) {}

  setConsumptionMode(mode: 'on-site' | 'takeaway'): void {
    this.consumptionService.setMode(mode);
    this.router.navigate(['/catalog']);
  }
}

