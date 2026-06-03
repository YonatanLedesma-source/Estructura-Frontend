import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../Services/Token.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'];
  const userRole = tokenService.getUserRole();

  // Si no está el rol definido o no coincide con los esperados
  if (!userRole || !expectedRoles || !expectedRoles.includes(userRole)) {
    console.warn(`Acceso denegado. Rol del usuario: ${userRole}. Roles esperados: ${expectedRoles}`);

    // Redirección inteligente al panel correspondiente según su rol
    if (userRole === 'ADMINISTRADOR' || userRole === 'ADMIN') {
      router.navigate(['/administradores']);
    } else if (userRole === 'OPERADOR' || userRole === 'OPERATOR') {
      router.navigate(['/operador']);
    } else if (userRole === 'CLIENTE' || userRole === 'BENEFICIARIO') {
      router.navigate(['/mi-panel']);
    } else if (userRole === 'PRESIDENTE') {
      router.navigate(['/presidente']);
    } else {
      // Si no tiene ningún rol válido en el sistema, lo enviamos a iniciar sesión
      tokenService.clearToken();
      router.navigate(['/auth/login']);
    }
    return false;
  }

  return true;
};
