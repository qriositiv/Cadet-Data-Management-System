import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Notification } from '../../interfaces/interfaces';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  notifications: Notification[] = [
    {
      notificationId: 0,
      cadetId: 'E07794',
      type: 'success',
      title: 'Prašimas patvirtintas',
      message: 'Jūsų prašimas nr. E07794 dėl ekipuotės užsakimo patvirtintas.',
      hidden: false,
    },
    {
      notificationId: 1,
      cadetId: 'L31313',
      type: 'fail',
      title: 'Prašimas atšauktas',
      message: 'Jūsų prašimas nr. L31313 dėl leidimo išrašimo atšauktas - "Neteisingai užpyldyti duomenys".',
      hidden: false,
    },
    {
      notificationId: 2,
      cadetId: 'N/A',
      type: '',
      title: 'Renginys vyksta dabar',
      message: 'Paskaita – diskusija „Lietuvos žvalgybos veiksmai prijungiant Klaipėdos kraštą”.',
      hidden: false,
    },
    {
      notificationId: 3,
      cadetId: 'N/A',
      type: 'important',
      title: 'Svarbi žinutė',
      message: 'Atkreipkite dėmesį į naujausius sistemos pakeitimus.',
      hidden: false,
    },
  ];

  closeNotification(notificationId: number) {
    const notification = this.notifications.find(n => n.notificationId === notificationId);
    if (notification) {
      notification.hidden = true;
    }
  }
}
