import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Event } from '../../interfaces';
import { CadetService } from '../../cadet.service';

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
    const startDate = event.dateFrom.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = event.dateTo.toISOString().replace(/-|:|\.\d+/g, '');
    const title = encodeURIComponent(event.title);
    const location = encodeURIComponent(event.location);
    const details = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&location=${location}`;
    window.open(details, '_blank');
  }
}
