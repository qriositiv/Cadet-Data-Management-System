import { Component } from '@angular/core';
import { CarEnterPermission } from '../../../interfaces/interfaces';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cep-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cep-manager.component.html'
})
export class CepManagerComponent {
  permissions: CarEnterPermission[] = [
    {
      permissionId: 1,
      cadetId: '12345',
      status: 'Patvirtintas',
      location: 'Base A',
      dateFrom: new Date('2024-12-01'),
      dateTo: new Date('2024-12-31'),
      carNumber: 'ABC123',
      carBrand: 'Toyota',
      additionalInformation: 'Urgent access needed fffffffff ffffffffffff ffffffffffffffffffff   f ff  ff fffffffffffffffffffff dfa sadf as dsd gsfg sdf gfsh sgjdfg jf',
    },
  ];

  isFormVisible = false;
  selectedPermission: CarEnterPermission | null = null;
  permissionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.permissionForm = this.fb.group({
      dateTo: [null, Validators.required],
      additionalInformation: [''],
      status: ['-', Validators.required],
    });
  }

  openForm(permission: CarEnterPermission) {
    this.selectedPermission = permission;
    this.isFormVisible = true;
    this.permissionForm.patchValue({
      dateTo: permission.dateTo,
      additionalInformation: permission.additionalInformation,
      status: permission.status,
    });
  }

  closeForm() {
    this.isFormVisible = false;
    this.selectedPermission = null;
  }

  saveChanges() {
    if (this.permissionForm.valid && this.selectedPermission) {
      const updatedData = this.permissionForm.value;
      this.permissions = this.permissions.map((permission) =>
        permission.permissionId === this.selectedPermission!.permissionId
          ? { ...permission, ...updatedData }
          : permission
      );
      this.closeForm();
    }
  }
}
