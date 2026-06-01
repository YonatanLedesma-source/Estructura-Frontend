import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/Services/Auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'Token de recuperación no válido o inexistente.';
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  async onSubmit() {
    if (this.resetForm.invalid || !this.token) {
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      const { newPassword } = this.resetForm.value;
      
      const res = await firstValueFrom(this.authService.resetPassword({
        token: this.token,
        newPassword
      }));

      this.successMessage = res.message;
      setTimeout(() => this.router.navigate(['/auth/login']), 3000);
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Error al restablecer la contraseña. El token podría haber expirado.';
    } finally {
      this.isLoading = false;
    }
  }
}
