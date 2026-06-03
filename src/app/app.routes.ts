import { Routes } from '@angular/router';
import { MainLayoutComponent } from './modules/layout/main-layout/main-layout.component';
import { authGuard } from './core/Guards/auth.guard';
import { roleGuard } from './core/Guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent) },
      
      // RUTA DE CLIENTES - GESTIÓN (Sólo Personal de Administración y Operadores)
      { 
        path: 'clientes', 
        loadComponent: () => import('./modules/Cliente/Cliente.component').then(m => m.ClienteComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADOR', 'OPERADOR'] }
      },
      
      // PANEL DE CLIENTE - PORTAL PERSONAL (Sólo Clientes / Beneficiarios)
      { 
        path: 'mi-panel', 
        loadComponent: () => import('./modules/panel-cliente/panel-cliente.component').then(m => m.PanelClienteComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['CLIENTE', 'BENEFICIARIO'] }
      },
      
      // REGISTRO DE MEDIDORES (Administradores y Operadores)
      { 
        path: 'medidores', 
        loadComponent: () => import('./modules/medidor/medidor.component').then(m => m.MedidorComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADOR', 'OPERADOR'] }
      },
      
      // HISTORIAL DE CONSUMOS (Administradores, Operadores y Clientes/Beneficiarios)
      { 
        path: 'historial-consumo', 
        loadComponent: () => import('./modules/historialconsumo/historialconsumo.component').then(m => m.HistorialConsumoComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADOR', 'OPERADOR', 'CLIENTE', 'BENEFICIARIO'] }
      },
      
      // PANEL DE ADMINISTRADOR (Sólo Administradores)
      { 
        path: 'administradores', 
        loadComponent: () => import('./modules/administrador/administrador.component').then(m => m.AdministradorComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },
      
      // PANEL DE OPERADOR (Sólo Operadores)
      { 
        path: 'operador', 
        loadComponent: () => import('./modules/operador/operador.component').then(m => m.OperadorComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['OPERADOR'] }
      },
      
      // PANEL DE PRESIDENTE (Sólo Presidentes)
      { 
        path: 'presidente', 
        loadComponent: () => import('./modules/presidente/presidente.component').then(m => m.PresidenteComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PRESIDENTE'] }
      },
      
      // REGISTRO DE LECTURAS (Administradores y Operadores)
      { 
        path: 'lectura', 
        loadComponent: () => import('./modules/lectura/lectura.component').then(m => m.LecturaComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMINISTRADOR', 'OPERADOR'] }
      },
      
      // RUTAS PÚBLICAS DE AUTENTICACIÓN
      {
        path: 'auth',
        children: [
          { path: 'login', loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent) },
          { path: 'registro', loadComponent: () => import('./modules/auth/registro/registro.component').then(m => m.RegistroComponent) },
          { path: 'reset-password', loadComponent: () => import('./modules/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) }
        ]
      },
      
      { path: '**', redirectTo: '' }
    ]
  }
];

