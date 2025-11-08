
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  authService = inject(AuthService);
  // Fix: Explicitly type `fb` as FormBuilder to resolve type inference issue with `inject()`.
  fb: FormBuilder = inject(FormBuilder);
  
  currentUser = this.authService.currentUser();

  profileForm = this.fb.group({
    name: [this.currentUser?.name, Validators.required],
    email: [this.currentUser?.email, [Validators.required, Validators.email]],
    phone: [this.currentUser?.phone, Validators.required]
  });

  saveProfile() {
    if (this.profileForm.valid) {
      console.log('Profile saved:', this.profileForm.value);
      // Here you would call a service to update the user data
      alert('تم حفظ التغييرات بنجاح!');
    }
  }
}
