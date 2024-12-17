import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserProfileData } from '../../../interfaces/interfaces'; // Adjust the path to your interface file
import { CadetService } from '../../../services/cadet.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  // The current active tab on the profile page, defaulting to 'basic'
  currentTab: string = 'basic';

  // Stores the profile data of the cadet
  cadet: UserProfileData | null = null;

  // Retrieves the cadet's ID from local storage
  cadetId: any = localStorage.getItem('cadetId');

  constructor(private cadetService: CadetService) {}

  /**
   * Lifecycle hook that runs on component initialization.
   * Fetches the user profile data from the service.
   */
  ngOnInit(): void {
    this.cadetService.getUserProfile(this.cadetId).subscribe(
      (data) => {
        // Sets the fetched cadet profile data
        this.cadet = data;
      },
      (err) => {
        // Logs any errors encountered while fetching the profile
        console.error('Error fetching user profile:', err);
      }
    );
  }

  /**
   * Updates the currently selected tab.
   * @param tab - The name of the tab to switch to (e.g., 'basic', 'contact', 'health', 'service').
   */
  selectTab(tab: string) {
    this.currentTab = tab;
  }
}
