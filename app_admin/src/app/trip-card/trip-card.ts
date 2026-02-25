import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard implements OnInit {
  @Input('trip') trip: any;

  constructor(private router: Router,
    private authenticationService: Authentication,
    private tripDataService: TripData) { }

  ngOnInit(): void {
  }

  public editTrip(trip: Trip) {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['/edit-trip']);
  }

  public isAdmin(): boolean {
    const token = this.authenticationService.getToken();
    if (!token) { return false; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role && payload.role === 'admin';
    } catch (e) {
      return false;
    }
  }

  public onRestore() {
    if (!this.trip || !this.trip.code) { return; }
    this.tripDataService.restoreTrip(this.trip.code).subscribe({
      next: () => {
        this.trip.deletedAt = null;
      },
      error: (err) => {
        console.error('Restore failed', err);
      }
    });
  }
}
