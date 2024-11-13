import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NotificationsComponent, ProfileComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
