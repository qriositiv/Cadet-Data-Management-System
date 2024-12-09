import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserDisciplineResults } from '../../interfaces/interfaces';
import { CadetService } from '../../services/cadet.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './results.component.html'
})
export class ResultsComponent {
  userDisciplineResults!: UserDisciplineResults;
  
  constructor(private cadetService: CadetService) {}

  ngOnInit(): void {
    const cadetId = 'LKA12345678901';
    this.cadetService.getUserDisciplineResults(cadetId).subscribe({
      next: (results) => {
        this.userDisciplineResults = results;        
      },
      error: (err) => {
        console.error('Failed to fetch discipline results:', err);
      }
    });
  }

  get resultsBelowMinimum(): number {
    return this.userDisciplineResults.results.filter(discipline => 
      (discipline.needMore && discipline.result < discipline.controlValue) || 
      (!discipline.needMore && discipline.result > discipline.controlValue)
    ).length;
  }  
}
