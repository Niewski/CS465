import { Routes } from '@angular/router';
import { AddTrip } from './add-trip/add-trip';
import { EditTrip } from './edit-trip/edit-trip';
import { authGuard } from './guards/auth.guard';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { TripListing } from './trip-listing/trip-listing';

export const routes: Routes = [
    { path: '', component: TripListing, pathMatch: 'full', canActivate: [authGuard] },
    { path: 'add-trip', component: AddTrip, canActivate: [authGuard] },
    { path: 'edit-trip', component: EditTrip, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
