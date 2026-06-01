import { Routes } from '@angular/router';
import { MainLayoutComponent } from './modules/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent) },
      { path: 'clientes', loadComponent: () => import('./modules/Cliente/Cliente.component').then(m => m.ClienteComponent) },
      { path: 'medidores', loadComponent: () => import('./modules/medidor/medidor.component').then(m => m.MedidorComponent) },
      { path: 'historial-consumo', loadComponent: () => import('./modules/historialconsumo/historialconsumo.component').then(m => m.HistorialConsumoComponent) },
      { path: 'administradores', loadComponent: () => import('./modules/administrador/administrador.component').then(m => m.AdministradorComponent) },
      { path: 'operador', loadComponent: () => import('./modules/operador/operador.component').then(m => m.OperadorComponent) },
      { path: 'presidente', loadComponent: () => import('./modules/presidente/presidente.component').then(m => m.PresidenteComponent) },
      { path: 'lectura', loadComponent: () => import('./modules/lectura/lectura.component').then(m => m.LecturaComponent) },
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

