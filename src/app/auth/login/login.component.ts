import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  mensajeError: string | null = null;

  form = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async iniciarSesion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    try {
      const response = await this._authService.login({ correo: email!, password: password! }).toPromise();

      if (!response || !response.token) {
        throw new Error('Error en la autenticación. No se recibió un token.');
      }

      // ✅ Redirigir según el rol
      if (response.role === 'Cajero') {
        this._router.navigate(['/dashboard-cajero']);
      } else {
        this._router.navigate(['/dashboard-usuario']);
      }
    } catch (error) {
      console.error('Error en el login:', error);
      this.mensajeError = 'Correo o contraseña incorrectos';
      setTimeout(() => (this.mensajeError = null), 5000);
    }
  }
}
