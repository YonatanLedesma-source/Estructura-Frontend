import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/Services/Auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  genderOptions = ['Femenino', 'Masculino', 'No binario', 'Prefiero no decirlo', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      identificacion: ['', Validators.required],
      genero: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  // Validación de contraseñas
  private passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  // SUBMIT
  async onSubmit() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    try {
      this.isLoading = true;
      this.resetMessages();

      const formValue = this.registerForm.value;
      const isEmail = formValue.identificacion.includes('@');

      const newUser = {
        nombreCompleto: formValue.nombreCompleto,
        email: isEmail ? formValue.identificacion : null,
        documento: !isEmail ? formValue.identificacion : null,
        genero: formValue.genero,
        password: formValue.password,
        rol: 'BENEFICIARIO' // rol por defecto
      };

      await firstValueFrom(this.authService.register(newUser));

      this.successMessage = '¡Registro exitoso! Redirigiendo al inicio de sesión...';
      setTimeout(() => this.router.navigate(['/auth/login']), 2000);
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Error al registrar usuario';
    } finally {
      this.isLoading = false;
    }
  }

  // Helpers
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  private resetMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
