import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  cadetIdentificationNumber: string = '';
  nationalIdentificationNumber: string = '';

  onSubmit() {
    if (this.cadetIdentificationNumber && this.nationalIdentificationNumber) {
      console.log('Cadet ID:', this.cadetIdentificationNumber);
      console.log('nationalIdentificationNumber:', this.nationalIdentificationNumber);
    } else {
      console.error('Both fields are required.');
    }
  }
}
