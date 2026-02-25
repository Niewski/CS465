import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TripCard } from '../trip-card/trip-card';

import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';

import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  imports: [CommonModule, TripCard, FormsModule],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripData]
})
export class TripListing implements OnInit {
  trips: Trip[] = [];
  message: string = '';
  searchTerm: string = '';
  categoryFilter: string = '';
  includeDeleted: boolean = false;

  constructor(private tripData: TripData,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authenticationService: Authentication) {
    console.log('trip-listing constructor');
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  private getStuff(): void {
    const options: any = {};
    if (this.categoryFilter) { options.category = this.categoryFilter; }
    if (this.searchTerm) { options.search = this.searchTerm; }
    if (this.includeDeleted) { options.includeDeleted = true; }

    this.tripData.getTrips(options).subscribe({
      next: (value: any) => {
        this.trips = value;
        this.cdr.detectChanges();
        if(value.length > 0)
        {
          this.message = 'There are ' + value.length + ' trips available.';
        }
        else{
          this.message = 'There were no trips retrieved from the database';
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    })
  }


  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }

  public onSearch() {
    this.getStuff();
  }

  public onCategoryChange() {
    this.getStuff();
  }

  public toggleIncludeDeleted() {
    this.getStuff();
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

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}
