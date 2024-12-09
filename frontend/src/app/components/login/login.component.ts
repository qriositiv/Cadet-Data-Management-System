import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthenticationData } from '../../interfaces/interfaces';
import { CadetService } from '../../services/cadet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private cadetService: CadetService, private router: Router) {
    this.loginForm = this.fb.group({
      cadetId: ['', [Validators.required, Validators.pattern(/^\w+$/)]],
      nationalId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValue: UserAuthenticationData = {
        cadetId: this.loginForm.value.cadetId,
        nationalId: Number(this.loginForm.value.nationalId),
      };

      this.cadetService.login(formValue).subscribe(
        (response) => {
          localStorage.setItem('cadetId', formValue.cadetId)
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('intendant', response.isIntendant.toString());
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Login failed:', error.error);
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
