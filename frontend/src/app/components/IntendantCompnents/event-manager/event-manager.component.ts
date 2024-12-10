import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Event } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { CadetService } from '../../../services/cadet.service';
import { IntendantService } from '../../../services/intendant.service';

@Component({
  selector: 'app-event-manager',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-manager.component.html'
})
export class EventManagerComponent implements OnInit {
  events: Event[] = [];

  isFormVisible = false;
  eventForm: FormGroup;

  constructor(private fb: FormBuilder, private cadetService: CadetService, private intendantService: IntendantService) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
      location: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  deleteEvent(eventId: number): void {
    this.intendantService.deleteEvent(eventId).subscribe(
      (response) => {
        console.log('Event deleted:', response);
        this.events = this.events.filter(event => event.eventId !== eventId);
        this.loadEvents();
      },
      (error) => {
        console.error('Error deleting event:', error);
      }
    );
  }

  loadEvents(): void {
    this.cadetService.getEvents().subscribe(
      (data) => {
        this.events = data;
        console.log(data);
        
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  addEvent() {
    if (this.eventForm.valid) {
      const newEvent = {
        ...this.eventForm.value,
        dateFrom: new Date(this.eventForm.value.dateFrom).toISOString(),
        dateTo: new Date(this.eventForm.value.dateTo).toISOString(),
      };
  
      this.intendantService.postEvent(newEvent).subscribe(
        (response) => {
          console.log('Event created:', response);
          this.events.push({
            ...newEvent,
            eventId: response.eventId,
          });
          this.eventForm.reset();
          this.toggleFormVisibility();
        },
        (error) => {
          console.error('Error creating event:', error);
        }
      );
    }
  }
}
