import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'token';

  constructor() {}

  // GUARDAR TOKEN
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // OBTENER TOKEN
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ELIMINAR TOKEN
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // DECODIFICAR TOKEN (Extrae el Payload del JWT)
  decodeToken(token: string | null = this.getToken()): any {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      // Decodificación de caracteres especiales UTF-8
      const escapedPayload = escape(decodedPayload);
      const utf8Payload = decodeURIComponent(escapedPayload);
      return JSON.parse(utf8Payload);
    } catch (error) {
      // Intento fallback si falla la decodificación UTF-8 compleja
      try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
      } catch (err) {
        console.error('Error al decodificar el token JWT:', err);
        return null;
      }
    }
  }

  // OBTENER EL ROL DEL USUARIO
  getUserRole(): string | null {
    const decoded = this.decodeToken();
    if (!decoded) return null;
    
    // Soporta múltiples formatos comunes de rol que devuelven los Backends (Spring Security, NestJS, .NET, Node, etc.)
    const role = decoded.rol || decoded.role || decoded.roles || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    
    if (Array.isArray(role)) {
      return role.length > 0 ? role[0].toUpperCase() : null;
    }
    
    return role ? role.toUpperCase() : null;
  }

  // OBTENER EL CORREO/IDENTIFICADOR DEL USUARIO
  getUserEmail(): string | null {
    const decoded = this.decodeToken();
    if (!decoded) return null;
    return decoded.sub || decoded.email || decoded.username || null;
  }

  // VERIFICAR SI EL TOKEN HA EXPIRADO
  isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) return false; // Si no tiene fecha, asumimos que no ha expirado
    
    const expiryTime = decoded.exp * 1000;
    return Date.now() >= expiryTime;
  }
}
