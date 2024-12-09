import { Component } from '@angular/core';
import { ExemptionFromPhysicalActivity } from '../../../interfaces/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-efpa-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './efpa-manager.component.html'
})
export class EfpaManagerComponent {
  exemptions: ExemptionFromPhysicalActivity[] = [
    {
      permissionId: 1,
      cadetId: '12345',
      status: 'Patvirtintas',
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-01-10'),
      documentPhotoUrl: 'https://via.placeholder.com/100',
      additionalInformation: 'Medical leave approved.',
    },
  ];

  isFormVisible = false;
  selectedExemption: ExemptionFromPhysicalActivity | null = null;

  exemptionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.exemptionForm = this.fb.group({
      cadetId: ['', Validators.required],
      status: ['Nepatvirtintas', Validators.required],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
      documentPhotoUrl: ['', Validators.required],
      additionalInformation: [''],
    });
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

  submitForm() {
    if (this.exemptionForm.valid) {
      const formData = this.exemptionForm.value;

      if (this.selectedExemption) {
        // Update existing exemption
        this.exemptions = this.exemptions.map((exemption) =>
          exemption.permissionId === this.selectedExemption!.permissionId
            ? { ...exemption, ...formData }
            : exemption
        );
      } else {
        // Create new exemption
        const newExemption: ExemptionFromPhysicalActivity = {
          permissionId: Date.now(),
          ...formData,
        };
        this.exemptions.push(newExemption);
      }

      this.toggleForm();
    }
  }
}
