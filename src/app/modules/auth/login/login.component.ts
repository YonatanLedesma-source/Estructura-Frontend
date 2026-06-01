import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/Services/Auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isForgotPasswordMode = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Formulario de login
    this.loginForm = this.fb.group({
      documento: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Formulario de recuperación
    this.forgotPasswordForm = this.fb.group({
      identificador: ['', Validators.required]
    });
  }

  // LOGIN
  async onSubmit() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    try {
      this.isLoading = true;
      this.resetMessages();

      const { documento, password } = this.loginForm.value;
      const credentials: { email?: string; documento?: string; password: string } = { password };
      if (documento?.includes('@')) {
        credentials.email = documento;
      } else {
        credentials.documento = documento;
      }

      const user = await firstValueFrom(
        this.authService.login(credentials)
      );

      // Guardar token si viene en la respuesta
      if (user.token) {
        this.authService.saveToken(user.token);
      }

      // Redirección según rol
      const role = user.rol?.toUpperCase();
      if (role === 'BENEFICIARIO' || role === 'CLIENTE') {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/panel-control']);
      }
    } catch (error: any) {
      this.errorMessage = this.extractError(error);
    } finally {
      this.isLoading = false;
    }
  }

  // RECUPERAR CONTRASEÑA
  async onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    try {
      this.isLoading = true;
      this.resetMessages();

      const { identificador } = this.forgotPasswordForm.value;
      const res = await firstValueFrom(
        this.authService.forgotPassword(identificador)
      );

      this.successMessage = res.message;
      this.isForgotPasswordMode = false;
    } catch (error: any) {
      this.errorMessage = this.extractError(error);
    } finally {
      this.isLoading = false;
    }
  }

  // Alternar entre login y recuperación
  toggleForgotPasswordMode() {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    this.resetMessages();
  }

  // Helpers
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private resetMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private extractError(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    } else if (typeof error.error === 'string') {
      return error.error;
    } else {
      return 'Ocurrió un error inesperado';
    }
  }
}
