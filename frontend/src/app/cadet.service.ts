import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CarEnterPermission, Event, LoginResponse, UserAuthenticationData, UserProfileData } from './interfaces';

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
  
}
