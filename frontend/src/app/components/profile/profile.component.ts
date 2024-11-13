import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  currentTab: string = 'basic';

  cadet = {
    basicInformation: {
      photoUrl: 'https://avatars.githubusercontent.com/u/116667154?v=4&size=64',
      cadetId: 'VIL123456',
      name: 'Arsenij Nikulin',
      dateOfBirth: '2003 - 12 - 26',
      civilId: '5031226****'
    },
    contactInformation: {
      phone: '+37063013123',
      email: 'qriositiv@gmail.com',
      address: 'Baltijos pr. XX / XX, Klaipėda, Klaipėdos apsk.',
    },
    healthInformation: {
      bloodType: 'O+',
      height: 180.0,
      weight: 75.7, 
      allergies: 'Žuvys, riešutai',
      medicalConditions: 'Astma'
    }
  };

  constructor() { }

  selectTab(tab: string) {
    this.currentTab = tab;
  }
}
