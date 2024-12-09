import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CadetService } from '../../services/cadet.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  mobileMenuOpen: boolean = false;
  dropdownOpen = false;
  @Input() intendantMenu: string = 'false';

  constructor(private router: Router, public cadetService: CadetService) {}

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
  }
}
