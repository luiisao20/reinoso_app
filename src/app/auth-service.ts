import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environment/environment';
import { lastValueFrom, Observable } from 'rxjs';
import { AuthResponse } from './models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private AUTH_URL = `${environment.apiUrl}/auth`;

  isChecking = signal<boolean>(false);
  isAuthenticated = signal<boolean>(false);

  login(email: string, password: string): Observable<AuthResponse> {
    this.isAuthenticated.set(true);
    return this.http.post<AuthResponse>(`${this.AUTH_URL}/login`, { email, password });
  }

  async checkAuthStatus(): Promise<boolean> {
    if (this.isAuthenticated()) return true;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      this.isAuthenticated.set(false);
      this.isChecking.set(false);
      return false;
    }

    try {
      await lastValueFrom(this.http.get(`${this.AUTH_URL}/validate`));
      this.isAuthenticated.set(true);
      return true;
    } catch (error) {
      this.logout();
      return false;
    } finally {
      this.isChecking.set(false);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    this.isAuthenticated.set(false);
  }
}
