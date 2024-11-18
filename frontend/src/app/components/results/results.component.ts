import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html'
})
export class ResultsComponent {
  user = {
    name: 'Antanas Antanauskas',
    sex: 'Vyras',
    age: 22
  };

  disciplines = [
    { name: 'Atsispaudimai (vnt)', result: 85, control: 70, needsMore: true },
    { name: 'Atsilenkimai (vnt)', result: 72, control: 70, needsMore: true },
    { name: 'Begimas 3 km. (min)', result: 15.0, control: 15.5, needsMore: false },
  ];

  get resultsBelowMinimum(): number {
    return this.disciplines.filter(discipline => 
      (discipline.needsMore && discipline.result < discipline.control) || 
      (!discipline.needsMore && discipline.result > discipline.control)
    ).length;
  }  
}
