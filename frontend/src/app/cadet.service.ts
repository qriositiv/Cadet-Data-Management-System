import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CarEnterPermission, Discipline, Equipment, Event, ExemptionFromPhysicalActivity, LoginResponse, UserAuthenticationData, UserDisciplineResults, UserProfileData } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CadetService {
  private apiUrl = 'http://localhost:5000/';

  constructor(private http: HttpClient) {}

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
    return this.http.get<UserProfileData>(this.apiUrl + 'profile/' + cadetId);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl + 'events');
  }

  getCarPermissions(cadetId: string): Observable<CarEnterPermission[]> {
    return this.http
      .get<{ enterWithCarPermissions: CarEnterPermission[] }>(`${this.apiUrl}permission/car/${cadetId}`)
      .pipe(map((response) => response.enterWithCarPermissions));
  }

  createCarPermission(permission: CarEnterPermission): Observable<CarEnterPermission> {
    return this.http.post<CarEnterPermission>(`${this.apiUrl}permission/car`, permission);
  }

  getPhysicalPermissions(cadetId: string): Observable<ExemptionFromPhysicalActivity[]> {
    return this.http.get<ExemptionFromPhysicalActivity[]>(`${this.apiUrl}permission/physical/${cadetId}`);
  }
  
  createPhysicalPermission(permission: ExemptionFromPhysicalActivity): Observable<ExemptionFromPhysicalActivity> {
    return this.http.post<ExemptionFromPhysicalActivity>(`${this.apiUrl}permission/physical`, permission);
  } 
  
  uploadDocumentPhoto(file: File): Observable<{ file_name: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ file_name: string }>(this.apiUrl + 'upload', formData);
  }

  getAllEquipment(cadetId: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrl + 'equipment/' + cadetId);
  }

  updateUserEquipment(orderData: { cadetId: string, equipmentId: number; size: string; status: string }): Observable<any> {
    return this.http.put(this.apiUrl + 'updateUserEquipment', orderData);
  }

  getUserDisciplineResults(cadetId: string): Observable<UserDisciplineResults> {
    return this.http.get<UserDisciplineResults>(this.apiUrl + 'user-discipline-results/' + cadetId);
  }

  getDisciplines(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.apiUrl + 'disciplines');
  }
}
