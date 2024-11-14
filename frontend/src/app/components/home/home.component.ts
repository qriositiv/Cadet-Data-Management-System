import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { EventsComponent } from "../events/events.component";
import { InventoryComponent } from "../inventory/inventory.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NotificationsComponent, ProfileComponent, EventsComponent, InventoryComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
