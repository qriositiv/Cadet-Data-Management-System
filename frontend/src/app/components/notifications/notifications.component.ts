import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent {
  notifications = [
    {
      id: 0,
      type: 'success',
      title: 'Prašimas patvirtintas',
      message: 'Jūsų prašimas nr. E07794 dėl ekipuotės užsakimo patvirtintas.',
      closed: false
    },
    {
      id: 1,
      type: 'fail',
      title: 'Prašimas atšauktas',
      message: 'Jūsų prašimas nr. L31313 dėl leidimo išrašimo atsauktas - "Neteisingai užpylditi duomenys".',
      closed: false
    },
    {
      id: 1,
      type: '',
      title: 'Renginis vyksta dabar',
      message: 'Paskaita – diskusija „Lietuvos žvalgybos veiksmai prijungiant Klaipėdos kraštą”".',
      closed: false
    },
    {
      id: 1,
      type: 'important',
      title: '',
      message: '',
      closed: false
    }
  ];

  closeNotification(notificationId: number) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }  
}
