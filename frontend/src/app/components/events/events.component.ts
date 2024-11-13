import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html'
})
export class EventsComponent {
  events = [
    { 
      id: 1, 
      title: 'Paskaita – diskusija „Lietuvos žvalgybos veiksmai prijungiant Klaipėdos kraštą”', 
      startDate: new Date(new Date().getTime() - 3600 * 1000),
      endDate: new Date(new Date().getTime() + 3600 * 1000),
      location: 'LITEXPO, Vilnius'
    },
    { 
      id: 2, 
      title: 'Karo istoriko prof. dr. Valdo Rakučio knygos PRIEŠ PANYRANT Į SUTEMAS pristatymas', 
      startDate: new Date(new Date().getTime() + 7200 * 1000),
      endDate: new Date(new Date().getTime() + 10800 * 1000),
      location: 'Poligonas, Kaunas'
    },
    // { 
    //   id: 3, 
    //   title: 'Event 3', 
    //   startDate: new Date(new Date().getTime() + 14400 * 1000), // Starts in 4 hours
    //   endDate: new Date(new Date().getTime() + 18000 * 1000), // Ends in 5 hours
    //   location: 'Location C'
    // },
    // { 
    //   id: 3, 
    //   title: 'Event 3', 
    //   startDate: new Date(new Date().getTime() + 14400 * 1000), // Starts in 4 hours
    //   endDate: new Date(new Date().getTime() + 18000 * 1000), // Ends in 5 hours
    //   location: 'Location C'
    // }
  ];
  
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

  isEventLive(event: any): boolean {
    const now = new Date();
    return now >= event.startDate && now <= event.endDate;
  }

  exportToGoogleCalendar(event: any) {
    const startDate = event.startDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = event.endDate.toISOString().replace(/-|:|\.\d+/g, '');
    const title = encodeURIComponent(event.title);
    const location = encodeURIComponent(event.location);
    const details = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&location=${location}`;
    window.open(details, '_blank');
  }
}
