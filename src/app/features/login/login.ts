import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  CardComponent,
  InputComponent,
  ButtonComponent,
  SpinnerComponent,
  DialogComponent,
} from 'garaq-angular-components';
import { AuthService } from '../../auth-service';

interface LoginData {
  email: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    CardComponent,
    InputComponent,
    ButtonComponent,
    SpinnerComponent,
    DialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly showPassword = signal(false);
  protected readonly rememberMe = signal(false);
  protected readonly loading = signal(false);
  protected readonly submitAttempted = signal(false);
  protected readonly submittedData = signal<LoginData | null>(null);

  protected readonly emailInvalid = computed(() => this.submitAttempted() && !this.email().trim());
  protected readonly passwordInvalid = computed(() => this.submitAttempted() && !this.password());

  private authService = inject(AuthService);
  private router = inject(Router);

  protected onLogin(): void {
    if (this.loading()) return;
    this.submitAttempted.set(true);
    if (!this.email().trim() || !this.password()) return;

    this.loading.set(true);
    this.authService.login(this.email(), this.password()).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.jwt);
        localStorage.setItem('email', res.email);
        localStorage.setItem('role', res.role);
        this.loading.set(false);
        this.router.navigate(['info']);
      },

      error: (error) => {
        alert(error.message);
        this.loading.set(false);
      },
    });
  }

  protected onDialogClose(): void {
    this.submittedData.set(null);
    // Resetear formulario
    this.submitAttempted.set(false);
    this.email.set('');
    this.password.set('');
    this.rememberMe.set(false);
    this.showPassword.set(false);
  }
}
