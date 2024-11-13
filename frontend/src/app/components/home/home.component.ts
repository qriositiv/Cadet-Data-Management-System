import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { EventsComponent } from "../events/events.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NotificationsComponent, ProfileComponent, EventsComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
