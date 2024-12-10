import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarEnterPermission, Event } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class IntendantService {
  private apiUl = 'http://127.0.0.1:5000/';

  constructor(private http: HttpClient) {}

  postEvent(event: Event): Observable<any> {
    return this.http.post(this.apiUl + 'events/new', event);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(this.apiUl + 'events/delete/' + eventId);
  }

  getUnapprovedCarPermissions(): Observable<CarEnterPermission[]> {
    return this.http.get<CarEnterPermission[]>(this.apiUl + 'permission/car/unapproved');
  }

  updatePermission(permissionId: number, updatedData: Partial<CarEnterPermission>): Observable<any> {
    return this.http.put(this.apiUl + 'permission/car/' + permissionId, updatedData);
  }
  
}
