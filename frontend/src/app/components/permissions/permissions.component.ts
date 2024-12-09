import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarEnterPermission, ExemptionFromPhysicalActivity } from '../../interfaces/interfaces'; // Adjust the path as necessary
import { CadetService } from '../../services/cadet.service';
import { CepComponent } from "./cep/cep.component";
import { EfpaComponent } from "./efpa/efpa.component";

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CepComponent, EfpaComponent],
  templateUrl: './permissions.component.html',
})
export class PermissionsComponent {

}
