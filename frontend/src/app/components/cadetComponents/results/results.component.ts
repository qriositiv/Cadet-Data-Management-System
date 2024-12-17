import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CadetService } from '../../../services/cadet.service';
import { UserDisciplineResults } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './results.component.html'
})
export class ResultsComponent {
  // Stores the discipline results for the logged-in user
  userDisciplineResults!: UserDisciplineResults;

  constructor(private cadetService: CadetService) {}

  /**
   * Lifecycle hook that initializes the component.
   * Fetches the discipline results for the currently logged-in cadet.
   */
  ngOnInit(): void {
    const cadetId = localStorage.getItem('cadetId') || ''; // Retrieve cadet ID from local storage
    this.cadetService.getUserDisciplineResults(cadetId).subscribe({
      next: (results) => {
        // Assign the fetched discipline results to the component property
        this.userDisciplineResults = results;        
      },
      error: (err) => {
        // Log any errors encountered during the fetch
        console.error('Failed to fetch discipline results:', err);
      }
    });
  }

  /**
   * Getter to calculate the number of disciplines where the results are below the required standard.
   * - If `needMore` is true, the result must be greater than or equal to the control value.
   * - If `needMore` is false, the result must be less than or equal to the control value.
   * 
   * @returns The count of disciplines with results below the minimum standard.
   */
  get resultsBelowMinimum(): number {
    return this.userDisciplineResults.results.filter(discipline => 
      (discipline.needMore && discipline.result < discipline.controlValue) || 
      (!discipline.needMore && discipline.result > discipline.controlValue)
    ).length;
  }  
}
