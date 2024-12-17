import { Component, OnInit } from '@angular/core';
import { CarEnterPermission } from '../../../interfaces/interfaces';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IntendantService } from '../../../services/intendant.service';

@Component({
  selector: 'app-cep-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cep-manager.component.html'
})
export class CepManagerComponent implements OnInit {
  // List of car entry permissions to be displayed
  permissions: CarEnterPermission[] = [];

  // Controls form visibility
  isFormVisible = false;

  // Holds the currently selected permission for editing
  selectedPermission: CarEnterPermission | null = null;

  // Form group for updating a permission
  permissionForm: FormGroup;

  constructor(private fb: FormBuilder, private intendantService: IntendantService) {
    // Initialize the permission form with validation rules
    this.permissionForm = this.fb.group({
      dateTo: [null, Validators.required], // 'dateTo' field is required
      additionalInformation: [''], // Optional field for additional notes
      status: ['-', Validators.required], // 'status' field is required
    });
  }

  /**
   * Lifecycle hook that initializes the component.
   * Loads the unapproved car entry permissions.
   */
  ngOnInit(): void {
    this.loadUnapprovedPermissions();
  }

  /**
   * Fetches unapproved car entry permissions from the service
   * and assigns them to the `permissions` property.
   */
  loadUnapprovedPermissions(): void {
    this.intendantService.getUnapprovedCarPermissions().subscribe(
      (data) => {
        this.permissions = data; // Populate the permissions list
      },
      (error) => {
        console.error('Error fetching unapproved permissions:', error); // Log any errors
      }
    );
  }

  /**
   * Opens the form to edit a specific permission.
   * Pre-fills the form with the selected permission's data.
   *
   * @param permission - The permission to be edited
   */
  openForm(permission: CarEnterPermission) {
    this.selectedPermission = permission; // Set the selected permission
    this.isFormVisible = true; // Show the form
    this.permissionForm.patchValue({
      dateTo: permission.dateTo,
      additionalInformation: permission.additionalInformation,
      status: permission.status,
    }); // Pre-fill the form
  }

  /**
   * Closes the form and resets the selected permission.
   */
  closeForm() {
    this.isFormVisible = false; // Hide the form
    this.selectedPermission = null; // Reset the selected permission
  }

  /**
   * Submits the updated permission data.
   * Sends the updated information to the backend and refreshes the permissions list.
   */
  saveChanges() {
    if (this.permissionForm.valid && this.selectedPermission) {
      const updatedData = this.permissionForm.value; // Extract form values
  
      this.intendantService.updatePermission(this.selectedPermission.permissionId, updatedData).subscribe(
        (response) => {
          // Update the local list of permissions with the changes
          this.permissions = this.permissions.map((permission) =>
            permission.permissionId === this.selectedPermission!.permissionId
              ? { ...permission, ...updatedData }
              : permission
          );
          this.closeForm(); // Close the form
          this.loadUnapprovedPermissions(); // Reload the permissions
        },
        (error) => {
          console.error('Error updating permission:', error); // Log any errors
        }
      );
    }
  }  
}
