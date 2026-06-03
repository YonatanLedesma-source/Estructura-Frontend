import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../Services/Token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getToken();

  // Validar si el token existe y no está expirado
  if (token && !tokenService.isTokenExpired()) {
    return true;
  }

  // Si no está autenticado, limpiar cualquier token residual y mandar al login
  tokenService.clearToken();
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
