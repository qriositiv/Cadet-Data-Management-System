import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Event } from '../../../interfaces/interfaces';
import { CadetService } from '../../../services/cadet.service';

@Component({
  selector: 'app-events', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
})
export class EventsComponent implements OnInit {
  events: Event[] = []; // Fetched list of events
  showAllEvents = false; // Toggle for showing all events

  constructor(private cadetService: CadetService) {}

  // Lifecycle method to fetch events on component initialization
  ngOnInit(): void {
    this.cadetService.getEvents().subscribe(
      (data) => (this.events = data),
      (error) => console.error('Error fetching events:', error)
    );
  }

  // Returns the first 3 upcoming events
  get upcomingEvents() {
    return this.events.slice(0, 3);
  }

  // Returns the remaining events beyond the first 3
  get remainingEvents() {
    return this.events.slice(3);
  }

  // Toggles the visibility of all events
  toggleShowAll() {
    this.showAllEvents = !this.showAllEvents;
  }

  // Checks if a given event is currently live
  isEventLive(event: Event): boolean {
    const now = new Date();
    return now >= new Date(event.dateFrom) && now <= new Date(event.dateTo);
  }

  // Opens the Google Calendar event creation page with pre-filled details
  exportToGoogleCalendar(event: Event) {
    const startDate = new Date(event.dateFrom).toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(event.dateTo).toISOString().replace(/-|:|\.\d+/g, '');
    const title = encodeURIComponent(event.title);
    const location = encodeURIComponent(event.location || '');
    const details = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&location=${location}`;
    window.open(details, '_blank');
  }
}
