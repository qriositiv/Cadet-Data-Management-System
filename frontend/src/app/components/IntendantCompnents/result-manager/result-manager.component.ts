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
  // List of disciplines available for updating results
  disciplines: Discipline[] = [];

  // Reactive form for entering and submitting discipline results
  disciplineForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private intendantService: IntendantService, 
    private cadetService: CadetService
  ) {
    // Initialize the form with validation rules
    this.disciplineForm = this.fb.group({
      cadetId: ['', [Validators.required, Validators.maxLength(14)]], // Cadet ID with a max length of 14
      discipline: ['', Validators.required], // Discipline must be selected
      result: ['', [Validators.required, Validators.min(0)]], // Result must be a positive number
    });
  }

  /**
   * Lifecycle hook: Fetches the list of disciplines on component initialization.
   */
  ngOnInit(): void {
    this.cadetService.getDisciplines().subscribe(
      (data) => {
        this.disciplines = data; // Populate the disciplines list
      },
      (error) => {
        console.error('Error getting disciplines:', error); // Handle fetch errors
      }
    );
  }

  /**
   * Submits the form to update a cadet's discipline result.
   */
  submitForm(): void {
    if (this.disciplineForm.valid) {
      const formData = this.disciplineForm.value;

      // Prepare the payload for the API call
      const updatePayload = {
        cadetId: formData.cadetId, // Cadet ID
        disciplineId: formData.discipline, // Selected discipline
        result: formData.result, // Result value
      };

      this.intendantService.updateUserDisciplineResult(updatePayload).subscribe(
        () => {
          this.disciplineForm.reset(); // Reset the form on successful submission
        },
        (error) => {
          console.error('Error updating discipline result:', error); // Handle submission errors
        }
      );
    }
  }
}
