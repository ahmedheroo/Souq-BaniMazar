
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginError = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  login() {
    if (this.loginForm.valid) {
      this.loginError.set(null);
      const { email, password } = this.loginForm.getRawValue();
      this.authService.login(email!, password!).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/profile']);
          } else {
            this.loginError.set('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
          }
        },
        error: () => {
          this.loginError.set('حدث خطأ ما. يرجى المحاولة مرة أخرى.');
        }
      });
    }
  }
}
