import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent, FooterComponent } from '../../../_components';
import { LoginFormComponent } from '../../../_components/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatListModule, HeaderComponent, FooterComponent, LoginFormComponent],
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {
  constructor() {}
}
