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
  events: Event[] = [];

  constructor(private cadetService: CadetService) {}

  ngOnInit(): void {
    this.cadetService.getEvents().subscribe(
      (data) => {
        this.events = data;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }
  
  showAllEvents = false;

  get upcomingEvents() {
    return this.events.slice(0, 3);
  }

  get remainingEvents() {
    return this.events.slice(3);
  }

  toggleShowAll() {
    this.showAllEvents = !this.showAllEvents;
  }

  isEventLive(event: Event): boolean {
    const now = new Date();
    const dateFrom = new Date(event.dateFrom);
    const dateTo = new Date(event.dateTo);

    return now >= dateFrom && now <= dateTo;
  }
  
  exportToGoogleCalendar(event: Event) {
    // Ensure event.dateFrom and event.dateTo are valid Date objects
    const dateFrom = new Date(event.dateFrom);
    const dateTo = new Date(event.dateTo);
  
    // Convert dates to Google Calendar format: YYYYMMDDTHHmmssZ
    const startDate = dateFrom.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = dateTo.toISOString().replace(/-|:|\.\d+/g, '');
  
    // URL encode the title and location
    const title = encodeURIComponent(event.title);
    const location = encodeURIComponent(event.location || '');
  
    // Create Google Calendar URL
    const details = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&location=${location}`;
  
    // Open the Google Calendar event creation page
    window.open(details, '_blank');
  }
  
}
