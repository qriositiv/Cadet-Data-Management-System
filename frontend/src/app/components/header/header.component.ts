import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CadetService } from '../../services/cadet.service';
import { IntendantService } from '../../services/intendant.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  // State to manage the visibility of the mobile menu
  mobileMenuOpen: boolean = false;
  
  // State to manage the visibility of the dropdown menu
  dropdownOpen = false;

  // Stores the user's role
  role!: string;

  constructor(
    private router: Router,
    public cadetService: CadetService,
    private intendantService: IntendantService
  ) {}

  /**
   * Toggles the visibility of the dropdown menu.
   */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Toggles the visibility of the mobile menu.
   */
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Closes the mobile menu.
   */
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  /**
   * Logs the user out by clearing local storage and refreshing the page.
   */
  logout() {
    localStorage.removeItem('cadetId');
    localStorage.removeItem('access_token');
    localStorage.removeItem('intendant');
    window.location.reload();
  }

  /**
   * Lifecycle hook that initializes the component.
   * Fetches the user's role.
   */
  ngOnInit(): void {
    this.getUserRole();
  }

  /**
   * Retrieves the user's role from the service and assigns it to the `role` property.
   */
  getUserRole(): void {
    this.intendantService.getUserRole().subscribe(
      (response: any) => {
        this.role = response.role;
      },
      (error) => {
        console.error('Error fetching user role:', error);
      }
    );
  }
}
