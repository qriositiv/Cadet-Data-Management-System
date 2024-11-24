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
  physicalActivityPermissions: ExemptionFromPhysicalActivity[] = [];
  cadetId: string = 'LKA12345678901';
  uploadedFileName: string | null = null;

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
      carNumber: ['', Validators.required],
      carBrand: ['', Validators.required],
      cadetId: [this.cadetId],
      phoneNumber: ['+37067777777'],
      additionalInformation: [''],
      location: ['', [Validators.required, Validators.pattern(/^(Vilnius|Kaunas|Klaipėda)$/)]],
    });

    this.physicalPermissionForm = this.fb.group({
      documentPhoto: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cadetService.getCarPermissions(this.cadetId).subscribe({
      next: (permissions) => {
        this.enterWithCarPermissions = permissions.map(permission => ({
          ...permission,
          dateFrom: new Date(permission.dateFrom),
          dateTo: new Date(permission.dateTo),
        }));
      },
      error: (err) => {
        console.error('Failed to fetch car permissions:', err);
      },
    });

    this.cadetService.getPhysicalPermissions(this.cadetId).subscribe({
      next: (permissions: ExemptionFromPhysicalActivity[]) => {
        this.physicalActivityPermissions = permissions.map(permission => ({
          ...permission,
          dateFrom: new Date(permission.dateFrom),
          dateTo: new Date(permission.dateTo),
        }));
      },
      error: (err) => {
        console.error('Error fetching physical permissions:', err);
      }
    });
  }

  togglePhysicalPermissionFormVisibility() {
    this.isPhysicalPermissionFormVisible = !this.isPhysicalPermissionFormVisible;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.physicalPermissionForm.patchValue({ documentPhoto: file });
    }
  }

  submitPhysicalPermission(): void {
    if (this.physicalPermissionForm.valid) {
      const file = this.physicalPermissionForm.get('documentPhoto')!.value;
  
      // Step 1: Upload the file
      const formData = new FormData();
      formData.append('file', file);
  
      this.cadetService.uploadDocumentPhoto(file).subscribe({
        next: (response) => {
          const uploadedFileName = response.file_name; // Extract the uploaded file name or URL
  
          // Step 2: Create a new permission object
          const newPermission: ExemptionFromPhysicalActivity = {
            permissionId: 0,
            cadetId: this.cadetId,
            documentPhotoUrl: uploadedFileName, // Use the uploaded file URL
            status: 'Nepatvirtintas', // Default status
            dateFrom: new Date(), // Placeholder
            dateTo: new Date(), // Placeholder
            additionalInformation: '', // Optional field
          };
  
          // Step 3: Post the permission to the backend
          this.cadetService.createPhysicalPermission(newPermission).subscribe({
            next: (createdPermission) => {
              this.physicalActivityPermissions.push({
                ...createdPermission,
                dateFrom: new Date(createdPermission.dateFrom),
                dateTo: new Date(createdPermission.dateTo),
              });
  
              // Reset the form and UI states
              this.physicalPermissionForm.reset();
              this.isPhysicalPermissionFormVisible = false;
              alert(`Physical permission created successfully!`);
            },
            error: (err) => {
              console.error('Error creating physical permission:', err);
              alert('Failed to create physical permission!');
            },
          });
        },
        error: (err) => {
          console.error('Error uploading file:', err);
          alert('File upload failed!');
        },
      });
    } else {
      console.error('Form is invalid');
      this.physicalPermissionForm.markAllAsTouched();
    }
  }

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  submitPermission(): void {
    if (this.permissionForm.valid) {
      const formValue = this.permissionForm.value;

      const newPermission: CarEnterPermission = {
        permissionId: 0,
        cadetId: formValue.cadetId,
        status: 'Nepatvirtintas',
        location: formValue.location,
        dateFrom: new Date(formValue.dateFrom),
        dateTo: new Date(formValue.dateTo),
        carNumber: formValue.carNumber,
        carBrand: formValue.carBrand,
        additionalInformation: formValue.additionalInformation || '',
      };

      this.cadetService.createCarPermission(newPermission).subscribe({
        next: (createdPermission) => {
          this.enterWithCarPermissions.push({
            ...createdPermission,
            dateFrom: new Date(createdPermission.dateFrom),
            dateTo: new Date(createdPermission.dateTo),
          });

          this.permissionForm.reset({
            cadetId: this.cadetId,
          });

          this.isFormVisible = false;
        },
        error: (err) => {
          console.error('Failed to create permission:', err);
        },
      });
    } else {
      console.error('Form is invalid');
      this.permissionForm.markAllAsTouched();
    }
  }
}
