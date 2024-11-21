import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  mobileMenuOpen: boolean = false;
  dropdownOpen = false;

  constructor(router: Router) {}

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
    localStorage.removeItem('access_token');
  }
  
}
