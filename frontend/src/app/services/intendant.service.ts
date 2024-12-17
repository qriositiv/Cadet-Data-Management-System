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
  private apiUrl = 'http://127.0.0.1:5000/'; // Base API URL

  constructor(private http: HttpClient) {}

  // Helper method to add Authorization header for authenticated requests
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Event Management

  /**
   * Create a new event.
   * @param event - Event details.
   * @returns Observable for the create operation.
   */
  postEvent(event: Event): Observable<any> {
    return this.http.post(this.apiUrl + 'events/new', event, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Delete an event by ID.
   * @param eventId - Event identifier.
   * @returns Observable for the delete operation.
   */
  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'events/delete/' + eventId, {
      headers: this.getHeaders(),
    });
  }

  // Car Permissions Management

  /**
   * Fetch all unapproved car permissions.
   * @returns Observable containing a list of unapproved car permissions.
   */
  getUnapprovedCarPermissions(): Observable<CarEnterPermission[]> {
    return this.http.get<CarEnterPermission[]>(
      this.apiUrl + 'permission/car/unapproved',
      { headers: this.getHeaders() }
    );
  }

  /**
   * Update a car permission's details.
   * @param permissionId - Permission identifier.
   * @param updatedData - Partial data for updating the permission.
   * @returns Observable for the update operation.
   */
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

  /**
   * Fetch all unapproved exemptions from physical activity.
   * @returns Observable containing a list of unapproved exemptions.
   */
  getUnapprovedExemptions(): Observable<ExemptionFromPhysicalActivity[]> {
    return this.http.get<ExemptionFromPhysicalActivity[]>(
      this.apiUrl + '/permission/physical/unapproved',
      { headers: this.getHeaders() }
    );
  }

  /**
   * Update details of a physical activity exemption.
   * @param permissionId - Exemption identifier.
   * @param updatedData - Partial data for updating the exemption.
   * @returns Observable for the update operation.
   */
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

  // User Discipline Results Management

  /**
   * Update a cadet's discipline result.
   * @param data - Data containing cadet ID, discipline ID, and result.
   * @returns Observable for the update operation.
   */
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

  /**
   * Fetch all equipment with a processing status.
   * @returns Observable containing the equipment list.
   */
  getProcessingUserEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(
      this.apiUrl + '/user-equipment/processing',
      { headers: this.getHeaders() }
    );
  }

  /**
   * Update the status of a piece of equipment.
   * @param equipmentId - Equipment identifier.
   * @param cadetId - Cadet identifier.
   * @param status - New status for the equipment.
   * @returns Observable for the status update operation.
   */
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

  // User Role Management

  /**
   * Fetch the user's role.
   * @returns Observable containing the user's role.
   */
  getUserRole(): Observable<any> {
    return this.http.get(this.apiUrl + 'user-role', {
      headers: this.getHeaders(),
    });
  }
}
