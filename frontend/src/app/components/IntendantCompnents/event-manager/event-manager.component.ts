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
  // List of events managed by the intendant
  events: Event[] = [];

  // Form visibility toggle for adding a new event
  isFormVisible = false;

  // Reactive form group for managing event details
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cadetService: CadetService,
    private intendantService: IntendantService
  ) {
    // Initialize the event form with validation rules
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
      location: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  /**
   * Lifecycle hook: Fetches the events on component initialization.
   */
  ngOnInit(): void {
    this.loadEvents();
  }

  /**
   * Fetches the list of events from the server.
   */
  loadEvents(): void {
    this.cadetService.getEvents().subscribe(
      (data) => {
        this.events = data; // Populate the events list
      },
      (error) => {
        console.error('Error fetching events:', error); // Handle fetch errors
      }
    );
  }

  /**
   * Deletes an event by its ID and refreshes the event list.
   *
   * @param eventId - The ID of the event to delete
   */
  deleteEvent(eventId: number): void {
    this.intendantService.deleteEvent(eventId).subscribe(
      () => {
        // Remove the event locally after successful deletion
        this.events = this.events.filter(event => event.eventId !== eventId);
        this.loadEvents(); // Reload events to ensure consistency
      },
      (error) => {
        console.error('Error deleting event:', error); // Handle deletion errors
      }
    );
  }

  /**
   * Toggles the visibility of the event creation form.
   */
  toggleFormVisibility(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  /**
   * Adds a new event to the system by submitting the event form.
   */
  addEvent(): void {
    if (this.eventForm.valid) {
      const dateFrom = new Date(this.eventForm.value.dateFrom);
      const dateTo = new Date(this.eventForm.value.dateTo);

      // Adjust times to account for server or timezone differences
      dateFrom.setHours(dateFrom.getHours() + 2);
      dateTo.setHours(dateTo.getHours() + 2);

      const newEvent = {
        ...this.eventForm.value,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
      };

      this.intendantService.postEvent(newEvent).subscribe(
        (response) => {
          // Add the newly created event to the local list
          this.events.push({
            ...newEvent,
            eventId: response.eventId,
          });
          this.eventForm.reset(); // Reset the form
          this.toggleFormVisibility(); // Hide the form
        },
        (error) => {
          console.error('Error creating event:', error); // Handle creation errors
        }
      );
    }
  }
}
