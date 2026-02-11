import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { trips } from '../data/trips';

@Component({
  selector: 'app-trip-listing',
  imports: [JsonPipe],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
})
export class TripListing implements OnInit {
  trips: Array<any> = trips;

  constructor() { }

  ngOnInit(): void {
  }

}
