import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarEnterPermission, ExemptionFromPhysicalActivity } from '../../interfaces'; // Adjust the path as necessary
import { CadetService } from '../../cadet.service';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './permissions.component.html',
})
export class PermissionsComponent implements OnInit {
  enterWithCarPermissions: CarEnterPermission[] = [];

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

  constructor(private fb: FormBuilder, private cadetService: CadetService) {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysLaterStr = threeDaysLater.toISOString().split('T')[0];

    this.permissionForm = this.fb.group({
      dateFrom: [todayStr, Validators.required],
      dateTo: [threeDaysLaterStr, Validators.required],
      carNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{5,10}$/)]],
      carBrand: ['', Validators.required],
      cadetId: ['A12345', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+0-9\s-]+$/)]],
      additionalInformation: [''],
      location: ['', [Validators.required, Validators.pattern(/^(Vilnius|Kaunas|Klaipėda)$/)]],
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

  ngOnInit(): void {
    const cadetId = 'LKA12345678901';
    this.cadetService.getCarPermissions(cadetId).subscribe({
      next: (permissions) => {
        this.enterWithCarPermissions = permissions.map(permission => ({
          ...permission,
          dateFrom: new Date(permission.dateFrom),
          dateTo: new Date(permission.dateTo),
        }));
        console.log(this.enterWithCarPermissions);
      },
      error: (err) => {
        console.error('Failed to fetch car permissions:', err);
      },
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

  submitPermission(): void {
    if (this.permissionForm.valid) {
      const formValue = this.permissionForm.value;
  
      const newPermission: CarEnterPermission = {
        permissionId: this.enterWithCarPermissions.length + 1,
        cadetId: formValue.cadetId,
        status: formValue.status,
        location: formValue.location,
        dateFrom: new Date(formValue.dateFrom),
        dateTo: new Date(formValue.dateTo),
        carNumber: formValue.carNumber,
        carBrand: formValue.carBrand,
        additionalInformation: formValue.additionalInformation || '',
      };
  
      this.enterWithCarPermissions.push(newPermission);
  
      console.log('New Permission:', newPermission);
  
      this.permissionForm.reset({
        cadetId: 'LKA12345678901',
        status: 'Patvirtintas',
      });
  
      this.isFormVisible = false;
    } else {
      console.error('Form is invalid');
      this.permissionForm.markAllAsTouched();
    }
  }  
}
