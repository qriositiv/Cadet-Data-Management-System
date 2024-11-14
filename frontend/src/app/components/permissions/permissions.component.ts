import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent {
  permissions = [
    {
      id: 1,
      status: 'Patvirtintas',
      dateFrom: new Date('2023-11-01'),
      dateTo: new Date('2023-11-10'),
      carNumber: 'DDM088',
      brand: 'Toyota',
      userName: 'Antanas Antanauskas',
      phoneNumber: '+37067777777',
      additionalInfo: '',
      area: 'Vilnius' 
    },
  ];

  areas = ['Vilnius', 'Klaipėda', 'Kaunas'];
  isFormVisible: boolean = false;
  permissionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysLaterStr = threeDaysLater.toISOString().split('T')[0];

    this.permissionForm = this.fb.group({
      dateFrom: [todayStr, Validators.required],
      dateTo: [threeDaysLaterStr, Validators.required],
      carNumber: ['', Validators.required],
      brand: ['', Validators.required],
      userName: [{ value: this.permissions[0].userName, disabled: true }, Validators.required],
      phoneNumber: ['+37067777777', [Validators.required, Validators.pattern(/^[+0-9\s-]+$/)]],
      additionalInfo: [''],
      area: ['', Validators.required] 
    });
  }


  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  submitPermission() {
    if (this.permissionForm.valid) {
      const newPermission = { 
        ...this.permissionForm.getRawValue(), 
        status: 'Pending', 
        id: this.permissions.length + 1 
      };
      this.permissions.push(newPermission);
      this.permissionForm.reset({ userName: 'John Doe' });
    }
  }
}
