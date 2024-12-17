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
  // Form group to manage and validate login inputs 
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private cadetService: CadetService, 
    private router: Router
  ) {
    // Initialize the form with validation rules
    this.loginForm = this.fb.group({
      cadetId: ['', [Validators.required, Validators.pattern(/^\w+$/)]], // Cadet ID is required and must match a specific pattern
      password: ['', [Validators.required]], // Password is required
    });
  }

  /**
   * Handles the form submission for login.
   * - Validates the form before sending the login request.
   * - On success, stores authentication details in localStorage and redirects to the home page.
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      const formValue: UserAuthenticationData = {
        cadetId: this.loginForm.value.cadetId, // Cadet ID entered by the user
        password: this.loginForm.value.password, // Password entered by the user
      };

      this.cadetService.login(formValue).subscribe(
        (response) => {
          // Store authentication details in localStorage
          localStorage.setItem('cadetId', formValue.cadetId);
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('intendant', response.isIntendant.toString());

          // Navigate to the home page upon successful login
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Login failed:', error.error); // Log error if login fails
        }
      );
    } else {
      // Highlight invalid fields if the form is invalid
      this.loginForm.markAllAsTouched();
    }
  }
}
