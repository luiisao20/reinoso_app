import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth-service';
import { ButtonComponent } from 'garaq-angular-components';
import { Navbar } from './shared/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonComponent, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('sorteo-app');
  protected authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.checkAuthStatus();
  }

  onGoLogin() {
    this.router.navigate(['login']);
  }
}
