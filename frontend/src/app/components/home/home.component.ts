import { Component } from '@angular/core';
import { ProfileComponent } from '../cadetComponents/profile/profile.component';
import { EventsComponent } from "../cadetComponents/events/events.component";
import { NotificationsComponent } from '../cadetComponents/notifications/notifications.component';
import { ResultsComponent } from '../cadetComponents/results/results.component';
import { PermissionsComponent } from '../cadetComponents/permissions/permissions.component';
import { InventoryComponent } from '../cadetComponents/inventory/inventory.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NotificationsComponent, ProfileComponent, EventsComponent, InventoryComponent, ResultsComponent, PermissionsComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
