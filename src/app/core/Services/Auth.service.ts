import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../Environments/environments';

export interface RegisterUser {
  nombreCompleto: string;
  email?: string | null;
  documento?: string | null;
  genero: string;
  password: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // LOGIN
  login(credentials: { email?: string; documento?: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // REGISTRO
  register(data: RegisterUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // RECUPERAR CONTRASEÑA
  forgotPassword(identificador: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { identificador });
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    // Aquí puedes redirigir al login o limpiar más datos
  }

  // GUARDAR TOKEN
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // OBTENER TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // VERIFICAR SI ESTÁ AUTENTICADO
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // RESET PASSWORD
  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

}
