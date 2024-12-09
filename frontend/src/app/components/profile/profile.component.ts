import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserProfileData } from '../../interfaces/interfaces'; // Adjust the path to your interface file
import { CadetService } from '../../services/cadet.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  currentTab: string = 'basic';
  cadet: UserProfileData | null = null;
  cadetId: any = localStorage.getItem('cadetId');

  constructor(private cadetService: CadetService) {}

  ngOnInit(): void {
    this.cadetService.getUserProfile(this.cadetId).subscribe(
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
