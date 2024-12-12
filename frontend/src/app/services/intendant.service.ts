import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CarEnterPermission,
  Equipment,
  Event,
  ExemptionFromPhysicalActivity,
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class IntendantService {
  private apiUrl = 'http://127.0.0.1:5000/';

  constructor(private http: HttpClient) {}

  // Helper method to add Authorization header
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Events Management
  postEvent(event: Event): Observable<any> {
    return this.http.post(this.apiUrl + 'events/new', event, {
      headers: this.getHeaders(),
    });
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'events/delete/' + eventId, {
      headers: this.getHeaders(),
    });
  }

  // Car Permissions Management
  getUnapprovedCarPermissions(): Observable<CarEnterPermission[]> {
    return this.http.get<CarEnterPermission[]>(
      this.apiUrl + 'permission/car/unapproved',
      { headers: this.getHeaders() }
    );
  }

  updatePermission(
    permissionId: number,
    updatedData: Partial<CarEnterPermission>
  ): Observable<any> {
    return this.http.put(
      this.apiUrl + 'permission/car/' + permissionId,
      updatedData,
      { headers: this.getHeaders() }
    );
  }

  // Exemptions Management
  getUnapprovedExemptions(): Observable<ExemptionFromPhysicalActivity[]> {
    return this.http.get<ExemptionFromPhysicalActivity[]>(
      this.apiUrl + '/permission/physical/unapproved',
      { headers: this.getHeaders() }
    );
  }

  updateExemption(
    permissionId: number,
    updatedData: Partial<ExemptionFromPhysicalActivity>
  ): Observable<any> {
    return this.http.put(
      this.apiUrl + 'permission/physical/' + permissionId,
      updatedData,
      { headers: this.getHeaders() }
    );
  }

  // User Discipline Results
  updateUserDisciplineResult(data: {
    cadetId: string;
    disciplineId: number;
    result: number;
  }): Observable<any> {
    return this.http.put(this.apiUrl + 'user-discipline-results', data, {
      headers: this.getHeaders(),
    });
  }

  // User Equipment Management
  getProcessingUserEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(
      this.apiUrl + '/user-equipment/processing',
      { headers: this.getHeaders() }
    );
  }

  responseEquipment(
    equipmentId: number,
    cadetId: string,
    status: string
  ): Observable<any> {
    const payload = { cadetId, status };
    return this.http.put(
      this.apiUrl + 'user-equipment/' + equipmentId + '/status',
      payload,
      { headers: this.getHeaders() }
    );
  }

  // User Role
  getUserRole(): Observable<any> {
    return this.http.get(this.apiUrl + 'user-role', {
      headers: this.getHeaders(),
    });
  }
}
