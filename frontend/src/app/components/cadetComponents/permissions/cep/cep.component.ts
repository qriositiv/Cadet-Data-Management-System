import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CadetService } from '../../../../services/cadet.service';
import { CarEnterPermission } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-cep', 
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cep.component.html'
})
export class CepComponent {
  enterWithCarPermissions: CarEnterPermission[] = []; // List of car entry permissions
  cadetId: any = localStorage.getItem('cadetId'); // Current cadet ID from local storage
  locations!: string[]; // List of available locations
  permissionForm: FormGroup; // Form for submitting a car entry permission
  isFormVisible = false; // Toggle visibility of the permission form

  constructor(private fb: FormBuilder, private cadetService: CadetService) {
    // Prepopulate form dates with today's date and three days later
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysLaterStr = threeDaysLater.toISOString().split('T')[0];

    // Initialize the permission form
    this.permissionForm = this.fb.group({
      dateFrom: [todayStr, Validators.required],
      dateTo: [threeDaysLaterStr, Validators.required],
      carNumber: ['', [Validators.required, Validators.maxLength(6)]],
      carBrand: ['', Validators.required],
      cadetId: [this.cadetId], // Automatically set cadet ID
      location: ['', [Validators.required]],
      additionalInformation: ['', [Validators.required]],
    });
  }

  // Lifecycle hook to fetch initial data
  ngOnInit(): void {
    // Load available locations
    this.cadetService.getAllLocations().subscribe(
      data => (this.locations = data),
      error => console.error('Failed to load locations', error)
    );

    // Fetch existing car permissions
    this.cadetService.getCarPermissions(this.cadetId).subscribe({
      next: (permissions) => {
        this.enterWithCarPermissions = permissions.map(permission => ({
          ...permission,
          dateFrom: new Date(permission.dateFrom),
          dateTo: new Date(permission.dateTo),
        }));
      },
      error: (err) => console.error('Failed to fetch car permissions:', err),
    });
  }

  // Toggle the visibility of the permission form
  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  // Submit the permission form
  submitPermission(): void {
    if (this.permissionForm.valid) {
      const formValue = this.permissionForm.value;

      // Create a new permission object
      const newPermission: CarEnterPermission = {
        permissionId: 0, // Placeholder ID; will be replaced by the server
        cadetId: formValue.cadetId,
        status: 'Nepatvirtintas', // Default status for new permissions
        location: formValue.location,
        dateFrom: new Date(formValue.dateFrom),
        dateTo: new Date(formValue.dateTo),
        carNumber: formValue.carNumber,
        carBrand: formValue.carBrand,
        additionalInformation: formValue.additionalInformation,
      };

      // Send the permission data to the server
      this.cadetService.createCarPermission(newPermission).subscribe({
        next: (createdPermission) => {
          // Add the newly created permission to the local list
          this.enterWithCarPermissions.push({
            ...createdPermission,
            dateFrom: new Date(createdPermission.dateFrom),
            dateTo: new Date(createdPermission.dateTo),
          });
          // Reset the form and hide it
          this.permissionForm.reset({ cadetId: this.cadetId });
          this.isFormVisible = false;
        },
        error: (err) => console.error('Failed to create permission:', err),
      });
    } else {
      console.error('Form is invalid'); // Log if the form is invalid
      this.permissionForm.markAllAsTouched(); // Highlight invalid fields
    }
  }
}
