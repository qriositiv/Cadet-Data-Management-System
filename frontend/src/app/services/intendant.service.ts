import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarEnterPermission, Event, ExemptionFromPhysicalActivity } from '../interfaces/interfaces';

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
  
  getUnapprovedExemptions(): Observable<ExemptionFromPhysicalActivity[]> {
    return this.http.get<ExemptionFromPhysicalActivity[]>(this.apiUl + '/permission/physical/unapproved');
  }

  updateExemption(
    permissionId: number,
    updatedData: Partial<ExemptionFromPhysicalActivity>
  ): Observable<any> {
    return this.http.put(this.apiUl + 'permission/physical/' + permissionId, updatedData);
  }

  updateUserDisciplineResult(data: {
    cadetId: string;
    disciplineId: number;
    result: number;
  }): Observable<any> {
    return this.http.put(this.apiUl + 'user-discipline-results', data);
  }
}
