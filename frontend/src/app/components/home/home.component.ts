import { Component } from '@angular/core';
import { ProfileComponent } from '../cadetComponents/profile/profile.component';
import { EventsComponent } from "../cadetComponents/events/events.component";
import { NotificationsComponent } from '../cadetComponents/notifications/notifications.component';
import { ResultsComponent } from '../cadetComponents/results/results.component';
import { PermissionsComponent } from '../cadetComponents/permissions/permissions.component';
import { InventoryComponent } from '../cadetComponents/inventory/inventory.component';
import { ResultManagerComponent } from '../IntendantCompnents/result-manager/result-manager.component';
import { EquipmentManagerComponent } from '../IntendantCompnents/equipment-manager/equipment-manager.component';
import { EfpaManagerComponent } from '../IntendantCompnents/efpa-manager/efpa-manager.component';
import { CepManagerComponent } from '../IntendantCompnents/cep-manager/cep-manager.component';
import { EventManagerComponent } from '../IntendantCompnents/event-manager/event-manager.component';
import { IntendantService } from '../../services/intendant.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NotificationsComponent, ProfileComponent, EventsComponent, InventoryComponent, ResultsComponent, PermissionsComponent, EventManagerComponent, CepManagerComponent, EfpaManagerComponent, EquipmentManagerComponent, ResultManagerComponent, LoginComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  // Stores the user's role
  role!: string;

  constructor(private intendantService: IntendantService) {}

  /**
   * Lifecycle hook that initializes the component.
   * Fetches the user's role upon component load.
   */
  ngOnInit(): void {
    this.getUserRole();
  }

  /**
   * Retrieves the user's role from the service and assigns it to the `role` property.
   * Sets the role to 'undefined' if an error occurs during the fetch.
   */
  getUserRole(): void {
    this.intendantService.getUserRole().subscribe(
      (response: any) => {
        this.role = response.role; // Assign the role if the response is successful
      },
      (error) => {
        console.error('Error fetching user role:', error);
        this.role = 'undefined'; // Assign a default value if the fetch fails
      }
    );
  }
}
