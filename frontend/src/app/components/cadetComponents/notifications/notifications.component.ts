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
  notifications: Notification[] = []; // List of notifications for the cadet

  constructor(private cadetService: CadetService) {}

  // Lifecycle hook to initialize the component
  ngOnInit(): void {
    this.fetchNotifications();
  }

  // Fetches notifications for the current cadet
  fetchNotifications(): void {
    const cadetId = localStorage.getItem('cadetId') || ''; // Retrieve cadet ID from local storage
    this.cadetService.getNotificationsByCadet(cadetId).subscribe(
      (data) => (this.notifications = data), // Update the notifications list
      (error) => console.error('Error fetching notifications:', error) // Log errors if the API call fails
    );
  }

  // Marks a notification as hidden
  hideNotification(notificationId: number): void {
    this.cadetService.hideNotification(notificationId).subscribe({
      next: () => {
        // Update the local notification list to mark the notification as hidden
        this.notifications = this.notifications.map(notification =>
          notification.notificationId === notificationId
            ? { ...notification, hidden: true }
            : notification
        );
        this.fetchNotifications(); // Refresh notifications list
      },
      error: (error) => console.error('Error hiding notification:', error) // Log errors if the API call fails
    });
  }
}
