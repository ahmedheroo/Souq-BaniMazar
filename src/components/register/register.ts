import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  step = signal(1);
  phoneVerified = signal(false);
  idUploaded = signal(false);
  fileName = signal('');
  registerForm: any;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      details: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      }),
      phone: this.fb.group({
        number: ['', Validators.required],
        code: ['']
      }),
      nationalId: ['']
    });
  }

  nextStep() {
    this.step.update(s => s + 1);
  }

  prevStep() {
    this.step.update(s => s - 1);
  }

  verifyPhone() {
    this.phoneVerified.set(true);
    setTimeout(() => this.nextStep(), 1000);
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.idUploaded.set(true);
      this.fileName.set(fileList[0].name);
    }
  }

  submitRegistration() {
    console.log('Registration submitted:', this.registerForm.value);
    alert('تم إرسال طلب التسجيل بنجاح! سيتم مراجعته من قبل الإدارة.');
    this.step.set(4);
  }
}
