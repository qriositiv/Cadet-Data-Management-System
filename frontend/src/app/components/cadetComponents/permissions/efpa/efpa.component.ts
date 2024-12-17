import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CadetService } from '../../../../services/cadet.service';
import { ExemptionFromPhysicalActivity } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-efpa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './efpa.component.html'
})
export class EfpaComponent {
  // Stores a list of physical activity permissions for the current cadet
  physicalActivityPermissions: ExemptionFromPhysicalActivity[] = [];

  // Retrieves the cadet's ID from local storage
  cadetId: any = localStorage.getItem('cadetId');

  // Form group for submitting a physical activity permission request
  physicalPermissionForm: FormGroup;

  // Toggles the visibility of the form
  isPhysicalPermissionFormVisible = false;

  constructor(private fb: FormBuilder, private cadetService: CadetService) {
    // Initialize the form with a required file input for document upload
    this.physicalPermissionForm = this.fb.group({
      documentPhoto: ['', Validators.required],
    });
  }

  // Lifecycle hook: Fetches existing physical activity permissions when the component initializes
  ngOnInit(): void {
    this.cadetService.getPhysicalPermissions(this.cadetId).subscribe({
      next: (permissions) => {
        // Maps the permissions to ensure `dateFrom` and `dateTo` are proper Date objects
        this.physicalActivityPermissions = permissions.map(permission => ({
          ...permission,
          dateFrom: new Date(permission.dateFrom),
          dateTo: new Date(permission.dateTo),
        }));
      },
      error: (err) => console.error('Error fetching physical permissions:', err),
    });
  }
  
  // Toggles the visibility of the physical activity permission form
  togglePhysicalPermissionFormVisibility() {
    this.isPhysicalPermissionFormVisible = !this.isPhysicalPermissionFormVisible;
  }
  
  // Handles file selection for the document upload
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Updates the form with the selected file
      this.physicalPermissionForm.patchValue({ documentPhoto: file });
    }
  }
  
  // Submits a physical activity permission request
  submitPhysicalPermission(): void {
    if (this.physicalPermissionForm.valid) {
      const file = this.physicalPermissionForm.get('documentPhoto')!.value;

      // Prepare the file for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload the file to the server
      this.cadetService.uploadDocumentPhoto(file).subscribe({
        next: (response) => {
          const uploadedFileName = response.file_name;

          // Create a new permission object with the uploaded file name
          const newPermission: ExemptionFromPhysicalActivity = {
            permissionId: 0, // Placeholder; ID will be assigned by the server
            cadetId: this.cadetId,
            documentPhotoUrl: uploadedFileName, // URL for the uploaded document
            status: 'Nepatvirtintas', // Default status
            dateFrom: new Date(), // Default start date
            dateTo: new Date(), // Default end date
            additionalInformation: '', // Optional field for extra details
          };

          // Submit the new permission to the server
          this.cadetService.createPhysicalPermission(newPermission).subscribe({
            next: (createdPermission) => {
              // Add the newly created permission to the local list
              this.physicalActivityPermissions.push({
                ...createdPermission,
                dateFrom: new Date(createdPermission.dateFrom),
                dateTo: new Date(createdPermission.dateTo),
              });

              // Reset the form and hide it
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
      this.physicalPermissionForm.markAllAsTouched(); // Highlight invalid fields
    }
  }
}
