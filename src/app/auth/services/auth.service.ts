import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthState } from '../interfaces/auth-state.interface';
import { LOGOUT_AUTH_STATE } from '../const/logout-auth-state.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authState =  signal<AuthState>(LOGOUT_AUTH_STATE);

  isAuthenticated : Signal<boolean> = computed(() => this.authState().isAuthenticated);

  currentUser: Signal<User> = computed(() => ({
    userId: this.authState().userId,
    email: this.authState().email
  }));


  constructor() {
    this.loadAuthState();
  }

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.id);
        // trace de l'utilisateur connecté
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('userId', response.userId.toString());
        
        this.authState.set({
          userId: response.userId,
          email: credentials.email,
          isAuthenticated: true
        });
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    
    this.authState.set(LOGOUT_AUTH_STATE);
  }

  private loadAuthState() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');

    if (token && email && userId) {
      this.authState.set({
        userId: parseInt(userId, 10),
        email: email,
        isAuthenticated: true
      });
    }
  }
}
