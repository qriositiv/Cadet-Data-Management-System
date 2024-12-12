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
  mobileMenuOpen: boolean = false;
  dropdownOpen = false;

  constructor(private router: Router, public cadetService: CadetService, private intendantService: IntendantService) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  logout() {
    localStorage.removeItem('cadetId');
    localStorage.removeItem('access_token');
    localStorage.removeItem('intendant');
    window.location.reload();
  }

  role!: string;

  ngOnInit(): void {
    this.getUserRole();
    
  }

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
