import { Component } from '@angular/core';
import { Discipline } from '../../interfaces/interfaces';
import { CadetService } from '../../services/cadet.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-table.component.html'
})
export class ResultsTableComponent {
  disciplines: Discipline[] = [];

  constructor(private cadetService: CadetService) {}

  ngOnInit(): void {
    this.cadetService.getDisciplines().subscribe((data: Discipline[]) => {
      this.disciplines = data;
      console.log(data);
    });
  }
}
