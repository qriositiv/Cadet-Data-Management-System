import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { EventsComponent } from "../events/events.component";
import { InventoryComponent } from "../inventory/inventory.component";
import { ResultsComponent } from "../results/results.component";
import { PermissionsComponent } from "../permissions/permissions.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NotificationsComponent, ProfileComponent, EventsComponent, InventoryComponent, ResultsComponent, PermissionsComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
