import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root',
})
export class TripData {
  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
    ) {}

  baseUrl = 'http://localhost:3000/api';
  url = 'http://localhost:3000/api/trips';

  getTrips(options?: { category?: string; search?: string; includeDeleted?: boolean }): Observable<Trip[]> {
    let params = new HttpParams();
    if (options?.category) {
      params = params.set('category', options.category);
    }
    if (options?.search) {
      params = params.set('search', options.search);
    }
    if (options?.includeDeleted) {
      params = params.set('includeDeleted', 'true');
    }
    return this.http.get<Trip[]>(this.url, { params });
  }

  deleteTrip(tripCode: string): Observable<any> {
    return this.http.delete(`${this.url}/${tripCode}`);
  }

  restoreTrip(tripCode: string): Observable<any> {
    return this.http.patch(`${this.url}/${tripCode}/restore`, {});
  }

  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.url, formData);
  }

  getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.url}/${tripCode}`);
  }

  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.url}/${formData.code}`, formData);
  }

  // Call to our /login endpoint, returns JWT
  login(user: User, passwd: string) : Observable<AuthResponse> {
    // console.log('Inside TripDataService::login');
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to our /register endpoint, creates user and returns JWT
  register(user: User, passwd: string) : Observable<AuthResponse> {
    // console.log('Inside TripDataService::register');
    return this.handleAuthAPICall('register', user, passwd);
  }

  // helper method to process both login and register methods
  handleAuthAPICall(endpoint: string, user: User, passwd: string) :
    Observable<AuthResponse> {
      // console.log('Inside TripDataService::handleAuthAPICall');
      let formData = {
        name: user.name,
        email: user.email,
        password: passwd
      };
      
      return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint,
      formData);
  }
}
