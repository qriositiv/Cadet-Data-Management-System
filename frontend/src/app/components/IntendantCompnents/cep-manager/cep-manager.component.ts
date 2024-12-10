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
  permissions: CarEnterPermission[] = [];

  isFormVisible = false;
  selectedPermission: CarEnterPermission | null = null;
  permissionForm: FormGroup;

  constructor(private fb: FormBuilder, private intendantService: IntendantService) {
    this.permissionForm = this.fb.group({
      dateTo: [null, Validators.required],
      additionalInformation: [''],
      status: ['-', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUnapprovedPermissions();
  }

  loadUnapprovedPermissions(): void {
    this.intendantService.getUnapprovedCarPermissions().subscribe(
      (data) => {
        this.permissions = data;
      },
      (error) => {
        console.error('Error fetching unapproved permissions:', error);
      }
    );
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
  
      this.intendantService.updatePermission(this.selectedPermission.permissionId, updatedData).subscribe(
        (response) => {
          console.log('Permission updated:', response);
          this.permissions = this.permissions.map((permission) =>
            permission.permissionId === this.selectedPermission!.permissionId
              ? { ...permission, ...updatedData }
              : permission
          );
          this.closeForm();
          this.loadUnapprovedPermissions();
        },
        (error) => {
          console.error('Error updating permission:', error);
        }
      );
    }
  }  
}
