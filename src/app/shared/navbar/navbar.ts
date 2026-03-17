import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonComponent } from 'garaq-angular-components';
import {AuthService} from '../../auth-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly menuOpen = signal(false);
  private authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
  }
}
