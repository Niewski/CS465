import { Routes } from '@angular/router';
import { AddTrip } from './add-trip/add-trip';
import { TripListing } from './trip-listing/trip-listing';

export const routes: Routes = [
    { path: '', component: TripListing, pathMatch: 'full' },
    { path: 'add-trip', component: AddTrip }
];
