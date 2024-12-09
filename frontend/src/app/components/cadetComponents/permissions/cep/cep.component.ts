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
  enterWithCarPermissions: CarEnterPermission[] = [];
  cadetId: any = localStorage.getItem('cadetId');
  locations!: string[];
  permissionForm: FormGroup;
  isFormVisible = false;

  constructor(private fb: FormBuilder, private cadetService: CadetService) {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysLaterStr = threeDaysLater.toISOString().split('T')[0];

    this.permissionForm = this.fb.group({
      dateFrom: [todayStr, Validators.required],
      dateTo: [threeDaysLaterStr, Validators.required],
      carNumber: ['', [Validators.required, Validators.maxLength(6)]],
      carBrand: ['', Validators.required],
      cadetId: [this.cadetId],
      location: ['', [Validators.required]],
      additionalInformation: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cadetService.getAllLocations().subscribe(
      data => (this.locations = data),
      error => console.error('Failed to load locations', error)
    );
    
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
        additionalInformation: formValue.additionalInformation
      };

      this.cadetService.createCarPermission(newPermission).subscribe({
        next: (createdPermission) => {
          this.enterWithCarPermissions.push({
            ...createdPermission,
            dateFrom: new Date(createdPermission.dateFrom),
            dateTo: new Date(createdPermission.dateTo),
          });
          this.permissionForm.reset({ cadetId: this.cadetId });
          this.isFormVisible = false;
        },
        error: (err) => console.error('Failed to create permission:', err),
      });
    } else {
      console.error('Form is invalid');
      this.permissionForm.markAllAsTouched();
    }
  }
}
