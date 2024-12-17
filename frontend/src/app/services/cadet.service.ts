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
  private apiUrl = 'http://localhost:5000/'; // Base API URL

  constructor(private http: HttpClient) {}

  // Generate headers for requests requiring authentication
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Authenticate user with provided credentials.
   * @param userData - User credentials.
   * @returns Observable containing login response.
   */
  login(userData: UserAuthenticationData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + 'login', userData);
  }

  /**
   * Check if a user is authenticated.
   * @returns Boolean indicating authentication status.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Fetch all available locations.
   * @returns Observable containing a list of locations.
   */
  getAllLocations(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + 'locations');
  }

  /**
   * Retrieve user profile data by cadet ID.
   * @param cadetId - Unique identifier for the user.
   * @returns Observable containing user profile data.
   */
  getUserProfile(cadetId: string): Observable<UserProfileData> {
    return this.http.get<UserProfileData>(this.apiUrl + 'profile/' + cadetId, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Fetch all events.
   * @returns Observable containing a list of events.
   */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl + 'events');
  }

  /**
   * Fetch car permissions for a given cadet.
   * @param cadetId - Unique identifier for the cadet.
   * @returns Observable containing car permissions.
   */
  getCarPermissions(cadetId: string): Observable<CarEnterPermission[]> {
    return this.http
      .get<{ enterWithCarPermissions: CarEnterPermission[] }>(
        `${this.apiUrl}permission/car/${cadetId}`,
        { headers: this.getHeaders() }
      )
      .pipe(map((response) => response.enterWithCarPermissions));
  }

  /**
   * Create a new car permission request.
   * @param permission - Permission data.
   * @returns Observable containing the created permission.
   */
  createCarPermission(permission: CarEnterPermission): Observable<CarEnterPermission> {
    return this.http.post<CarEnterPermission>(`${this.apiUrl}permission/car`, permission, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Fetch physical activity exemptions for a cadet.
   * @param cadetId - Unique identifier for the cadet.
   * @returns Observable containing a list of exemptions.
   */
  getPhysicalPermissions(cadetId: string): Observable<ExemptionFromPhysicalActivity[]> {
    return this.http.get<ExemptionFromPhysicalActivity[]>(
      `${this.apiUrl}permission/physical/${cadetId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Create a new physical activity exemption.
   * @param permission - Exemption data.
   * @returns Observable containing the created exemption.
   */
  createPhysicalPermission(permission: ExemptionFromPhysicalActivity): Observable<ExemptionFromPhysicalActivity> {
    return this.http.post<ExemptionFromPhysicalActivity>(
      `${this.apiUrl}permission/physical`,
      permission,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Upload a document photo.
   * @param file - The file to upload.
   * @returns Observable containing the file name.
   */
  uploadDocumentPhoto(file: File): Observable<{ file_name: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ file_name: string }>(this.apiUrl + 'upload', formData, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Fetch equipment assigned to a cadet.
   * @param cadetId - Unique identifier for the cadet.
   * @returns Observable containing the equipment list.
   */
  getAllEquipment(cadetId: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrl + 'equipment/' + cadetId, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Update user equipment information.
   * @param orderData - Updated equipment data.
   * @returns Observable for the update operation.
   */
  updateUserEquipment(orderData: { cadetId: string; equipmentId: number; size: string; status: string }): Observable<any> {
    return this.http.put(this.apiUrl + 'updateUserEquipment', orderData, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Fetch discipline results for a cadet.
   * @param cadetId - Unique identifier for the cadet.
   * @returns Observable containing discipline results.
   */
  getUserDisciplineResults(cadetId: string): Observable<UserDisciplineResults> {
    return this.http.get<UserDisciplineResults>(this.apiUrl + 'user-discipline-results/' + cadetId, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Fetch all available disciplines.
   * @returns Observable containing the discipline list.
   */
  getDisciplines(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.apiUrl + 'disciplines', {
      headers: this.getHeaders(),
    });
  }

  /**
   * Fetch notifications for a cadet.
   * @param cadetId - Unique identifier for the cadet.
   * @returns Observable containing the notifications list.
   */
  getNotificationsByCadet(cadetId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl + 'notifications/' + cadetId);
  }

  /**
   * Hide a notification by its ID.
   * @param notificationId - Unique identifier for the notification.
   * @returns Observable for the hide operation.
   */
  hideNotification(notificationId: number): Observable<any> {
    return this.http.patch(this.apiUrl + 'notifications/' + notificationId + '/hide', {});
  }
}
