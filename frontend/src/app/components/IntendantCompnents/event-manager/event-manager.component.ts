import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Event } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-manager',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-manager.component.html'
})
export class EventManagerComponent {
  events: Event[] = [
    { eventId: 1, title: 'Meeting', dateFrom: new Date(), dateTo: new Date(), location: 'Office A' },
    { eventId: 2, title: 'Workshop', dateFrom: new Date(), dateTo: new Date(), location: 'Hall B' },
  ];

  isFormVisible = false;
  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
      location: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  deleteEvent(eventId: number) {
    this.events = this.events.filter((event) => event.eventId !== eventId);
  }

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  addEvent() {
    if (this.eventForm.valid) {
      const newEvent: Event = {
        eventId: Date.now(),
        ...this.eventForm.value,
        dateFrom: new Date(this.eventForm.value.dateFrom),
        dateTo: new Date(this.eventForm.value.dateTo),
      };      
      this.events.push(newEvent);
      this.eventForm.reset();
      this.toggleFormVisibility();
    }
  }
}
