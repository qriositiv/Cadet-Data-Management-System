import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthenticationData } from '../../interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      cadetId: ['', [Validators.required, Validators.pattern(/^\w+$/)]], // Ensure it's alphanumeric
      nationalId: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Ensure it's numeric
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValue: UserAuthenticationData = {
        cadetId: this.loginForm.value.cadetId,
        nationalId: Number(this.loginForm.value.nationalId),
      };

      console.log('User Authentication Data:', formValue);
    } else {
      this.loginForm.markAllAsTouched();
      console.error('Both fields are required and must be valid.');
    }
  }
}
