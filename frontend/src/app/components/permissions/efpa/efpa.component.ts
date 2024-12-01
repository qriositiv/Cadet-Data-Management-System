import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExemptionFromPhysicalActivity } from '../../../interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadetService } from '../../../cadet.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-efpa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './efpa.component.html'
})
export class EfpaComponent {
  physicalActivityPermissions: ExemptionFromPhysicalActivity[] = [];
  cadetId: any = localStorage.getItem('cadetId');
  physicalPermissionForm: FormGroup;
  isPhysicalPermissionFormVisible = false;

  constructor(private fb: FormBuilder, private cadetService: CadetService) {
    this.physicalPermissionForm = this.fb.group({
      documentPhoto: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cadetService.getPhysicalPermissions(this.cadetId).subscribe({
      next: (permissions) => {
        this.physicalActivityPermissions = permissions.map(permission => ({
          ...permission,
          dateFrom: new Date(permission.dateFrom),
          dateTo: new Date(permission.dateTo),
        }));
      },
      error: (err) => console.error('Error fetching physical permissions:', err),
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
  
      const formData = new FormData();
      formData.append('file', file);
  
      this.cadetService.uploadDocumentPhoto(file).subscribe({
        next: (response) => {
          const uploadedFileName = response.file_name;
  
          const newPermission: ExemptionFromPhysicalActivity = {
            permissionId: 0,
            cadetId: this.cadetId,
            documentPhotoUrl: uploadedFileName,
            status: 'Nepatvirtintas',
            dateFrom: new Date(),
            dateTo: new Date(),
            additionalInformation: '',
          };
  
          this.cadetService.createPhysicalPermission(newPermission).subscribe({
            next: (createdPermission) => {
              this.physicalActivityPermissions.push({
                ...createdPermission,
                dateFrom: new Date(createdPermission.dateFrom),
                dateTo: new Date(createdPermission.dateTo),
              });
  
              this.physicalPermissionForm.reset();
              this.isPhysicalPermissionFormVisible = false;
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
}
