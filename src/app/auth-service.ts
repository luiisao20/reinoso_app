import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { AuthResponse } from './models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private AUTH_URL = `${environment.apiUrl}/auth`;
  
  isAuthenticated = signal<boolean>(localStorage.getItem('token') !== null);

  login(email: string, password: string): Observable<AuthResponse> {
    this.isAuthenticated.set(true);
    return this.http.post<AuthResponse>(`${this.AUTH_URL}/login`, { email, password });
  }
}
