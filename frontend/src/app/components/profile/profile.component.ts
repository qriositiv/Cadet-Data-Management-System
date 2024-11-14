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
      photoUrl: 'https://scontent.fvno2-1.fna.fbcdn.net/v/t39.30808-6/419846769_362103126565306_5915889442625019673_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Vw7vbDTbi_gQ7kNvgEx67qh&_nc_zt=23&_nc_ht=scontent.fvno2-1.fna&_nc_gid=A2ArCOImR3uWw_xGb6GfpK-&oh=00_AYBvP2132ETy0WzhXnQDSzzSf1zn5vlcC-AHKUZNc3JPJA&oe=673AC13C',
      cadetId: 'LKA12345678901',
      name: 'Antanas Antanaitis',
      dateOfBirth: '2000 - 12 - 26',
      civilId: '5001226****'
    },
    contactInformation: {
      phone: '+37067777777',
      email: 'antanaitis.a@gmail.com',
      address: 'Minijos g. XX / XX, Vilnius, Vilniaus apsk.',
    },
    healthInformation: {
      bloodType: 'O+',
      sex: 'Vyras',
      height: 180.0,
      weight: 75.7, 
      allergies: 'Žuvys, riešutai',
      medicalConditions: 'Astma'
    },
    servieInformation: {
      cadetStatus: '',
    }
  };

  constructor() { }

  selectTab(tab: string) {
    this.currentTab = tab;
  }
}
