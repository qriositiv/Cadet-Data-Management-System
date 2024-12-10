import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Discipline } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { IntendantService } from '../../../services/intendant.service';
import { CadetService } from '../../../services/cadet.service';

@Component({
  selector: 'app-result-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './result-manager.component.html'
})
export class ResultManagerComponent implements OnInit {
  disciplines: Discipline[] = [];

  disciplineForm: FormGroup;

  constructor(private fb: FormBuilder, private intendantService: IntendantService, private cadetService: CadetService) {
    this.disciplineForm = this.fb.group({
      cadetId: ['', [Validators.required, Validators.maxLength(14)]],
      discipline: ['', Validators.required],
      result: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.cadetService.getDisciplines().subscribe(
      (data) => {
        this.disciplines = data;
      },
        (error) => {
          console.error('Error getting disciplines:', error);
        }
    );
  }

  submitForm() {
    if (this.disciplineForm.valid) {
      const formData = this.disciplineForm.value;
  
      const updatePayload = {
        cadetId: formData.cadetId,
        disciplineId: formData.discipline,
        result: formData.result,
      };
  
      this.intendantService.updateUserDisciplineResult(updatePayload).subscribe(
        (response) => {
          console.log('Discipline result updated successfully:', response);
          this.disciplineForm.reset();
        },
        (error) => {
          console.error('Error updating discipline result:', error);
        }
      );
    }
  }
}
