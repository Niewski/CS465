import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css',
})
export class EditTrip implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message : string = '';

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private tripDataService: TripData
              ) {}

  ngOnInit() : void{
    // Retrieve stashed trip ID
    let tripCode = localStorage.getItem("tripCode");

    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripcode:' + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      nights: [1, [Validators.required, Validators.min(0)]],
      days: [2, [Validators.required, Validators.min(0)]],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required]
    });

    // Auto-update days when nights changes
    this.editForm.get('nights')!.valueChanges.subscribe((nightsValue: number) => {
      this.editForm.get('days')!.setValue(nightsValue + 1, { emitEvent: false });
    });

    this.tripDataService.getTrip(tripCode)
    .subscribe({
      next: (value: any) => {
        this.trip = value;
        // Format the date for the form
        const startFormatted = value?.start ? new Date(value.start).toISOString().slice(0, 10) : '';

        // Parse the length string into nights and days
        let nights = 1;
        let days = 2;
        if (value?.length) {
          const match = value.length.match(/(\d+)\s*nights?\s*\/\s*(\d+)\s*days?/i);
          if (match) {
            nights = parseInt(match[1], 10);
            days = parseInt(match[2], 10);
          }
        }

        // Populate our record into the form
        const { length, ...rest } = value;
        const patch = {
          ...rest,
          start: startFormatted,
          nights,
          days
        };

        this.editForm.patchValue(patch, { emitEvent: false });

        if(!value)
        {
          this.message = 'No Trip Retrieved!';
        }
        else{
          this.message = 'Trip: ' + tripCode + ' retrieved';
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    })
  }
  
  increment(field: 'nights' | 'days'): void {
    const control = this.editForm.get(field)!;
    control.setValue(control.value + 1);
  }

  decrement(field: 'nights' | 'days'): void {
    const control = this.editForm.get(field)!;
    if (control.value > 0) {
      control.setValue(control.value - 1);
    }
  }

  public onSubmit()
  {
    this.submitted = true;
    if(this.editForm.valid)
    {
      const formValue = this.editForm.value;
      const length = `${formValue.nights} nights / ${formValue.days} days`;
      const { nights, days, ...rest } = formValue;
      const tripData = { ...rest, length };

      this.tripDataService.updateTrip(tripData)
      .subscribe({
        next: (value: any) => {
          console.log(value);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
    }
  }

  public onDelete(): void {
    if (this.trip && confirm('Are you sure you want to delete this trip?')) {
      this.tripDataService.deleteTrip(this.trip.code)
      .subscribe({
        next: (value: any) => {
          console.log('Deleted', value);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
    }
  }

  // get the form short name to access the form fields
  get f() { return this.editForm.controls; }
}
