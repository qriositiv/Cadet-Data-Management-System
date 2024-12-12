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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NotificationsComponent, ProfileComponent, EventsComponent, InventoryComponent, ResultsComponent, PermissionsComponent, EventManagerComponent, CepManagerComponent, EfpaManagerComponent, EquipmentManagerComponent, ResultManagerComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  role!: string;

  constructor(private intendantService: IntendantService) {}

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
