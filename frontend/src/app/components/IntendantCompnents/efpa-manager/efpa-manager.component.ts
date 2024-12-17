import { Component } from '@angular/core';
import { ExemptionFromPhysicalActivity } from '../../../interfaces/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IntendantService } from '../../../services/intendant.service';

@Component({
  selector: 'app-efpa-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './efpa-manager.component.html'
})
export class EfpaManagerComponent {
  // List of unapproved physical activity exemptions
  exemptions: ExemptionFromPhysicalActivity[] = [];

  // Tracks whether the form is visible
  isFormVisible = false;

  // The currently selected exemption for editing
  selectedExemption: ExemptionFromPhysicalActivity | null = null;

  // Form group for exemption updates
  exemptionForm: FormGroup;

  constructor(private fb: FormBuilder, private intendantService: IntendantService) {
    // Initialize the form with default values and validators
    this.exemptionForm = this.fb.group({
      cadetId: ['', Validators.required], // Required Cadet ID field
      status: ['Nepatvirtintas', Validators.required], // Default status
      dateFrom: [null, Validators.required], // Start date of exemption
      dateTo: [null, Validators.required], // End date of exemption
      documentPhotoUrl: ['', Validators.required], // Required document photo URL
      additionalInformation: [''], // Optional additional information
    });
  }

  /**
   * Lifecycle hook: Loads unapproved exemptions when the component is initialized.
   */
  ngOnInit(): void {
    this.loadUnapprovedExemptions();
  }

  /**
   * Fetches unapproved physical activity exemptions from the service.
   */
  loadUnapprovedExemptions(): void {
    this.intendantService.getUnapprovedExemptions().subscribe(
      (data) => {
        this.exemptions = data; // Update the list of exemptions
      },
      (error) => {
        console.error('Error fetching unapproved exemptions:', error); // Log any errors
      }
    );
  }

  /**
   * Toggles the visibility of the form.
   * If an exemption is provided, pre-fills the form with its data.
   * Otherwise, resets the form for a new exemption.
   *
   * @param exemption - The exemption to edit, or `null` to reset the form
   */
  toggleForm(exemption: ExemptionFromPhysicalActivity | null = null): void {
    this.isFormVisible = !this.isFormVisible; // Toggle form visibility

    if (exemption) {
      this.selectedExemption = exemption; // Set the selected exemption
      this.exemptionForm.patchValue({
        cadetId: exemption.cadetId,
        status: exemption.status,
        dateFrom: exemption.dateFrom,
        dateTo: exemption.dateTo,
        documentPhotoUrl: exemption.documentPhotoUrl,
        additionalInformation: exemption.additionalInformation,
      }); // Pre-fill the form with the exemption's data
    } else {
      this.selectedExemption = null; // Clear the selected exemption
      this.exemptionForm.reset(); // Reset the form
    }
  }

  /**
   * Submits the form to update an exemption.
   * Sends the updated data to the service and refreshes the list.
   */
  submitForm(): void {
    if (this.exemptionForm.valid && this.selectedExemption) {
      const updatedData = this.exemptionForm.value; // Extract form values

      this.intendantService.updateExemption(
        this.selectedExemption.permissionId,
        updatedData
      ).subscribe(
        (response) => {
          // Update the local list of exemptions
          this.exemptions = this.exemptions.map((exemption) =>
            exemption.permissionId === this.selectedExemption!.permissionId
              ? { ...exemption, ...updatedData }
              : exemption
          );
          this.toggleForm(); // Close the form
          this.loadUnapprovedExemptions(); // Reload the exemptions list
        },
        (error) => {
          console.error('Error updating exemption:', error); // Log any errors
        }
      );
    }
  }
}
