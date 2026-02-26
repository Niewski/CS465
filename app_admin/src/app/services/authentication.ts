import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';
import { TripData } from '../services/trip-data';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root',
})

export class Authentication {
  // Setup our storage and service access
  constructor(
  @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripData,
    private router: Router
    ) { }

  // Variable to handle Authentication Responses
  authResp: AuthResponse = new AuthResponse();

  // Get our token from our Storage provider.
  // NOTE: For this application we have decided that we will name
  // the key for our token 'travlr-token'
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');

    // Make sure we return a string even if we don't have a token
    if(!out)
    {
      return '';
    }
    return out;
  }

  // Save our token to our Storage provider.
  // NOTE: For this application we have decided that we will name
  // the key for our token 'travlr-token'
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout of our application and remove the JWT from Storage
  // Also clear the server-side cookie by calling the Express logout endpoint
  public logout(): void {
    this.storage.removeItem('travlr-token');
    // Clear the travlr-token cookie via the Express logout route
    fetch('http://localhost:3000/logout', { credentials: 'include' }).catch(() => {});
    // Redirect to the login page after logout
    try {
      this.router.navigate(['/login']);
    } catch {
      // ignore navigation errors
    }
  }

  // Boolean to determine if we are logged in and the token is
  // still valid. Even if we have a token we will still have to
  // reauthenticate if the token has expired
  public isLoggedIn(): boolean {
    const token: string = this.getToken();

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > (Date.now() / 1000);
      } catch {
        // Token is corrupt — remove it and treat as logged out
        this.storage.removeItem('travlr-token');
        return false;
      }
    }

    return false;
  }
  
  // Retrieve the current user. This function should only be called
  // after the calling method has checked to make sure that the user
  // isLoggedIn.
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.email;
    const name = payload.name;
    const role = payload.role || '';
    return { email, name, role } as User;
  }

  // Login method that leverages the login method in tripDataService
  // Because that method returns an observable, we subscribe to the
  // result and only process when the Observable condition is satisfied
  // Uncomment the two console.log messages for additional debugging
  // information.
  public login(user: User, passwd: string) : void {
    this.tripDataService.login(user,passwd)
      .subscribe({
        next: (value: any) => {
          if(value)
          {
            console.log(value);
            this.authResp = value;
            this.saveToken(this.authResp.token);
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
    }

  // Register method that leverages the register method in
  // tripDataService
  // Because that method returns an observable, we subscribe to the
  // result and only process when the Observable condition is satisfied
  // Uncomment the two console.log messages for additional debugging
  // information. Please Note: This method is nearly identical to the
  // login method because the behavior of the API logs a new user in
  // immediately upon registration
  public register(user: User, passwd: string) : void {
    this.tripDataService.register(user,passwd)
      .subscribe({
      next: (value: any) => {
        if(value)
        {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    })
  }
}
