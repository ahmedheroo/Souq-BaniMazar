import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  step = signal(1);
  // phoneVerified = signal(false);
  idUploaded = signal(false);
  fileName = signal('');
  nationalIdFile: File | null = null;
  registerForm: any;

  constructor(private fb: FormBuilder,private auth: Auth,) {
    this.registerForm = this.fb.group({
      details: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      }),
      // phone: this.fb.group({
      //   number: ['', Validators.required],
      //   code: ['']
      // }),
      nationalId: ['']
    });
  }

  nextStep() {
    this.step.update(s => s + 1);
  }

  prevStep() {
    this.step.update(s => s - 1);
  }

  // verifyPhone() {
  //   this.phoneVerified.set(true);
  //   setTimeout(() => this.nextStep(), 1000);
  // }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.nationalIdFile = fileList[0];
      this.idUploaded.set(true);
      this.fileName.set(fileList[0].name);
    } else {
      this.nationalIdFile = null;
      this.idUploaded.set(false);
      this.fileName.set('');
    }
  }

  submitRegistration() {
    if (!this.registerForm.get('details')?.valid || !this.nationalIdFile) {
      return;
    }
    const details = this.registerForm.get('details')!.value;
    const payload = {
      name: details.name,
      email: details.email,
      password: details.password,
      phoneNumber: details.phone,
      nationalId: this.nationalIdFile,
    };
        this.auth.register(payload).subscribe({
      next: () => {
        this.step.set(3);
      },
            error: (err) => {
        console.error('Register error', err);
        this.step.set(4);
      },
          });
  }
}
