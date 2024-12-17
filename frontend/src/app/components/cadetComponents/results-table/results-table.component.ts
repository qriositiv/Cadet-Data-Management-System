import { Component } from '@angular/core';
import { Discipline } from '../../../interfaces/interfaces';
import { CadetService } from '../../../services/cadet.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-table.component.html'
})
export class ResultsTableComponent {
  // Stores the list of all available disciplines
  disciplines: Discipline[] = [];

  constructor(private cadetService: CadetService) {}

  /**
   * Lifecycle hook that initializes the component.
   * Fetches the list of disciplines from the server via the cadet service.
   */
  ngOnInit(): void {
    this.cadetService.getDisciplines().subscribe((data: Discipline[]) => {
      // Assign the fetched list of disciplines to the component property
      this.disciplines = data;
    });
  }
}
