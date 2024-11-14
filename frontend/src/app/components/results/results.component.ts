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
    { name: 'Mathematics', result: 85, minimum: 70 },
    { name: 'Physics', result: 60, minimum: 65 },
    { name: 'Chemistry', result: 72, minimum: 70 },
  ];

  get resultsBelowMinimum(): number {
    return this.disciplines.filter(discipline => discipline.result < discipline.minimum).length;
  }
}
