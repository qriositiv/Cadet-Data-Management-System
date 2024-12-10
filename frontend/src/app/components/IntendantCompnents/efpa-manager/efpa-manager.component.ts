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
  exemptions: ExemptionFromPhysicalActivity[] = [];

  isFormVisible = false;
  selectedExemption: ExemptionFromPhysicalActivity | null = null;

  exemptionForm: FormGroup;

  constructor(private fb: FormBuilder, private intendantService: IntendantService) {
    this.exemptionForm = this.fb.group({
      cadetId: ['', Validators.required],
      status: ['Nepatvirtintas', Validators.required],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
      documentPhotoUrl: ['', Validators.required],
      additionalInformation: [''],
    });
  }

  ngOnInit(): void {
    this.loadUnapprovedExemptions();
  }

  loadUnapprovedExemptions(): void {
    this.intendantService.getUnapprovedExemptions().subscribe(
      (data) => {
        this.exemptions = data;
        console.log('Unapproved Exemptions:', this.exemptions);
      },
      (error) => {
        console.error('Error fetching unapproved exemptions:', error);
      }
    );
  }

  toggleForm(exemption: ExemptionFromPhysicalActivity | null = null) {
    this.isFormVisible = !this.isFormVisible;

    if (exemption) {
      this.selectedExemption = exemption;
      this.exemptionForm.patchValue({
        cadetId: exemption.cadetId,
        status: exemption.status,
        dateFrom: exemption.dateFrom,
        dateTo: exemption.dateTo,
        documentPhotoUrl: exemption.documentPhotoUrl,
        additionalInformation: exemption.additionalInformation,
      });
    } else {
      this.selectedExemption = null;
      this.exemptionForm.reset();
    }
  }

  submitForm(): void {
    if (this.exemptionForm.valid && this.selectedExemption) {
      const updatedData = this.exemptionForm.value;

      this.intendantService.updateExemption(
        this.selectedExemption.permissionId,
        updatedData
      ).subscribe(
        (response) => {
          console.log('Exemption updated:', response);
          this.exemptions = this.exemptions.map((exemption) =>
            exemption.permissionId === this.selectedExemption!.permissionId
              ? { ...exemption, ...updatedData }
              : exemption
          );
          this.toggleForm();
          this.loadUnapprovedExemptions();
        },
        (error) => {
          console.error('Error updating exemption:', error);
        }
      );
    }
  }
}
