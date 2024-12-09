import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Discipline } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './result-manager.component.html'
})
export class ResultManagerComponent {
  disciplines: Discipline[] = [
    { name: 'Running 100m', controlForMale: 15, controlForFemale: 18, controlValue: 15 },
    { name: 'Push-ups', controlForMale: 30, controlForFemale: 20, controlValue: 30 },
    { name: 'Sit-ups', controlForMale: 40, controlForFemale: 35, controlValue: 40 },
  ];

  disciplineForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.disciplineForm = this.fb.group({
      cadetId: ['', [Validators.required, Validators.maxLength(14)]],
      discipline: ['', Validators.required],
      result: ['', [Validators.required, Validators.min(0)]],
    });
  }

  submitForm() {
    if (this.disciplineForm.valid) {
      const formData = this.disciplineForm.value;
      console.log('Submitted Data:', formData);
      // Process the data (e.g., send it to the server or add to a list)
      this.disciplineForm.reset();
    }
  }
}
