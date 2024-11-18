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
  enterWithCarPermissions = [
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
    }
  ];

  physicalActivityPermissions = [
    {
      status: 'Patvirtintas',
      dateFrom: new Date('2023-11-01'),
      dateTo: new Date('2023-11-05'),
      additionalInfo: 'Sulaužita ranka.'
    }
  ];

  physicalPermissionForm: FormGroup;
  isPhysicalPermissionFormVisible = false;
  areas = ['Vilnius', 'Klaipėda', 'Kaunas'];
  isFormVisible = false;
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
      userName: [{ value: this.enterWithCarPermissions[0].userName, disabled: true }, Validators.required],
      phoneNumber: [this.enterWithCarPermissions[0].phoneNumber, [Validators.required, Validators.pattern(/^[+0-9\s-]+$/)]],
      additionalInfo: [''],
      area: ['', Validators.required]
    });

    this.physicalPermissionForm = this.fb.group({
      userName: ['', Validators.required],
      documentPhoto: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      additionalInfo: ['']
    });
  }

  togglePhysicalPermissionFormVisibility() {
    this.isPhysicalPermissionFormVisible = !this.isPhysicalPermissionFormVisible;
  }

  submitPhysicalPermission() {
    if (this.physicalPermissionForm.valid) {
      const newPermission = {
        ...this.physicalPermissionForm.value,
        status: 'Pending'
      };
      this.physicalActivityPermissions.push(newPermission);
      this.physicalPermissionForm.reset();
      this.isPhysicalPermissionFormVisible = false;
    }
  }

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  submitPermission() {
    if (this.permissionForm.valid) {
      const newPermission = {
        ...this.permissionForm.getRawValue(),
        status: 'Pending',
        id: this.enterWithCarPermissions.length + 1
      };
      this.enterWithCarPermissions.push(newPermission);
      this.permissionForm.reset({
        userName: this.enterWithCarPermissions[0].userName,
        phoneNumber: this.enterWithCarPermissions[0].phoneNumber,
        dateFrom: this.permissionForm.controls['dateFrom'].value,
        dateTo: this.permissionForm.controls['dateTo'].value
      });
      this.isFormVisible = false;
    }
  }
}
