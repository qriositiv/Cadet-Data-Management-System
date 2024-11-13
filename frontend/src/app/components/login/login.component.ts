import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      cadetIdentificationNumber: ['', Validators.required],
      nationalIdentificationNumber: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('cadetIdentificationNumber:', this.loginForm.value.cadetIdentificationNumber);
      console.log('nationalIdentificationNumber:', this.loginForm.value.nationalIdentificationNumber);
    } else {
      console.error('Both fields are required.');
    }
  }
}
