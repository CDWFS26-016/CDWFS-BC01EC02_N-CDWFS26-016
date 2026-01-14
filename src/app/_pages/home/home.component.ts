import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent, FooterComponent } from '../../_components';
import { ConsumptionService } from '../../_services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private consumptionService: ConsumptionService, private router: Router) {}

  setConsumptionMode(mode: 'on-site' | 'takeaway'): void {
    this.consumptionService.setMode(mode);
    this.router.navigate(['/catalog']);
  }
}

