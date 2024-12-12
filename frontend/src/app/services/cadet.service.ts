import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CarEnterPermission,
  Discipline,
  Equipment,
  Event,
  ExemptionFromPhysicalActivity,
  LoginResponse,
  Notification,
  UserAuthenticationData,
  UserDisciplineResults,
  UserProfileData,
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CadetService {
  private apiUrl = 'http://localhost:5000/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  login(userData: UserAuthenticationData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + 'login', userData);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAllLocations(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + 'locations');
  }

  getUserProfile(cadetId: string): Observable<UserProfileData> {
    return this.http.get<UserProfileData>(this.apiUrl + 'profile/' + cadetId, {
      headers: this.getHeaders(),
    });
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl + 'events');
  }

  getCarPermissions(cadetId: string): Observable<CarEnterPermission[]> {
    return this.http
      .get<{ enterWithCarPermissions: CarEnterPermission[] }>(
        `${this.apiUrl}permission/car/${cadetId}`,
        { headers: this.getHeaders() }
      )
      .pipe(map((response) => response.enterWithCarPermissions));
  }

  createCarPermission(permission: CarEnterPermission): Observable<CarEnterPermission> {
    return this.http.post<CarEnterPermission>(`${this.apiUrl}permission/car`, permission, {
      headers: this.getHeaders(),
    });
  }

  getPhysicalPermissions(cadetId: string): Observable<ExemptionFromPhysicalActivity[]> {
    return this.http.get<ExemptionFromPhysicalActivity[]>(
      `${this.apiUrl}permission/physical/${cadetId}`,
      { headers: this.getHeaders() }
    );
  }

  createPhysicalPermission(permission: ExemptionFromPhysicalActivity): Observable<ExemptionFromPhysicalActivity> {
    return this.http.post<ExemptionFromPhysicalActivity>(
      `${this.apiUrl}permission/physical`,
      permission,
      { headers: this.getHeaders() }
    );
  }

  uploadDocumentPhoto(file: File): Observable<{ file_name: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ file_name: string }>(this.apiUrl + 'upload', formData, {
      headers: this.getHeaders(),
    });
  }

  getAllEquipment(cadetId: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrl + 'equipment/' + cadetId, {
      headers: this.getHeaders(),
    });
  }

  updateUserEquipment(orderData: { cadetId: string; equipmentId: number; size: string; status: string }): Observable<any> {
    return this.http.put(this.apiUrl + 'updateUserEquipment', orderData, {
      headers: this.getHeaders(),
    });
  }

  getUserDisciplineResults(cadetId: string): Observable<UserDisciplineResults> {
    return this.http.get<UserDisciplineResults>(this.apiUrl + 'user-discipline-results/' + cadetId, {
      headers: this.getHeaders(),
    });
  }

  getDisciplines(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.apiUrl + 'disciplines', {
      headers: this.getHeaders(),
    });
  }

  getNotificationsByCadet(cadetId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl + 'notifications/' + cadetId);
  }

  hideNotification(notificationId: number): Observable<any> {
    return this.http.patch(this.apiUrl + 'notifications/' + notificationId + '/hide', {});
  }
}
