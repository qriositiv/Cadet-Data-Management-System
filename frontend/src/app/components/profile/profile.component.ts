import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserProfileData } from '../../interfaces'; // Adjust the path to your interface file
import { CadetService } from '../../cadet.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  currentTab: string = 'basic';
  cadet: UserProfileData | null = null;

  constructor(private cadetService: CadetService) {}

  ngOnInit(): void {
    const cadetId = 'LKA12345678901';
    this.cadetService.getUserProfile(cadetId).subscribe(
      (data) => {
        this.cadet = data;
      },
      (err) => {
        console.error('Error fetching user profile:', err);
      }
    );
  }

  selectTab(tab: string) {
    this.currentTab = tab;
  }
}
