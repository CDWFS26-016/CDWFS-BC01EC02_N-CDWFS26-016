import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services';

@Component({
  selector: 'app-logout',
  standalone: true,
  templateUrl: './logout.component.html',
  styles: [],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
