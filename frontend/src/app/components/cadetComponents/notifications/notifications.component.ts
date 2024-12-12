import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../interfaces/interfaces';
import { CadetService } from '../../../services/cadet.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private cadetService: CadetService) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    const cadetId = localStorage.getItem('cadetId') || '';
    this.cadetService.getNotificationsByCadet(cadetId).subscribe(
      (data) => (this.notifications = data),
      (error) => console.error('Error fetching notifications:', error)
    );
  }

  hideNotification(notificationId: number): void {
    this.cadetService.hideNotification(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.map(notification =>
          notification.notificationId === notificationId
            ? { ...notification, hidden: true }
            : notification
        );
        this.fetchNotifications();
      },
      error: (error) => console.error('Error hiding notification:', error)
    });
  }
}
