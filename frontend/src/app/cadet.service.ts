import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, LoginResponse, UserAuthenticationData } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CadetService {
  private apiUrl = 'http://localhost:5000/';

  constructor(private http: HttpClient) {}

  login(userData: UserAuthenticationData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + 'login', userData);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl + 'events');
  }
}
