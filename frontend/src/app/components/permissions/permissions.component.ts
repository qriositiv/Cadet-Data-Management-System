import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarEnterPermission, ExemptionFromPhysicalActivity } from '../../interfaces'; // Adjust the path as necessary

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './permissions.component.html',
})
export class PermissionsComponent {
  enterWithCarPermissions: CarEnterPermission[] = [
    {
      permissionId: 1,
      cadetId: 'A12345', // Example cadetId
      status: 'Patvirtintas',
      dateFrom: new Date('2023-11-01'),
      dateTo: new Date('2023-11-10'),
      carNumber: 'DDM088',
      carBrand: 'Toyota',
      additionalInformation: '',
      location: 'Vilnius',
    },
  ];

  physicalActivityPermissions: ExemptionFromPhysicalActivity[] = [
    {
      permissionId: 1,
      cadetId: 'A12345',
      status: 'Patvirtintas',
      dateFrom: new Date('2023-11-01'),
      dateTo: new Date('2023-11-05'),
      documentPhotoUrl: 'photo-url-example',
      additionalInformation: 'Sulaužita ranka.',
      location: 'Vilnius',
    },
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
      carBrand: ['', Validators.required],
      cadetId: ['A12345', Validators.required], // Example cadetId
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+0-9\s-]+$/)]],
      additionalInformation: [''],
      location: ['', Validators.required],
    });

    this.physicalPermissionForm = this.fb.group({
      cadetId: ['A12345', Validators.required], // Example cadetId
      documentPhotoUrl: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      additionalInformation: [''],
      location: ['', Validators.required],
    });
  }

  togglePhysicalPermissionFormVisibility() {
    this.isPhysicalPermissionFormVisible = !this.isPhysicalPermissionFormVisible;
  }

  submitPhysicalPermission() {
    if (this.physicalPermissionForm.valid) {
      const newPermission: ExemptionFromPhysicalActivity = {
        permissionId: this.physicalActivityPermissions.length + 1,
        ...this.physicalPermissionForm.value,
        status: 'Pending',
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
      const newPermission: CarEnterPermission = {
        permissionId: this.enterWithCarPermissions.length + 1,
        ...this.permissionForm.value,
        status: 'Pending',
      };
      this.enterWithCarPermissions.push(newPermission);
      this.permissionForm.reset({
        cadetId: 'A12345',
        dateFrom: this.permissionForm.controls['dateFrom'].value,
        dateTo: this.permissionForm.controls['dateTo'].value,
      });
      this.isFormVisible = false;
    }
  }
}
