import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  @Input('trip') trip: any;

  constructor() { }

  ngOnInit(): void {
  }

}
