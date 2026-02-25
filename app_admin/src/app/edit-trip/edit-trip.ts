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
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required]
    })

    this.tripDataService.getTrip(tripCode)
    .subscribe({
      next: (value: any) => {
        this.trip = value;
        // Format the date for the form
        const patch = {
          ...value,
          start: value?.start ? new Date(value.start).toISOString().slice(0, 10) : ''
        };
        
        // Populate our record into the form
        this.editForm.patchValue(patch);
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
  
  public onSubmit()
  {
    this.submitted = true;
    if(this.editForm.valid)
    {
      this.tripDataService.updateTrip(this.editForm.value)
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
