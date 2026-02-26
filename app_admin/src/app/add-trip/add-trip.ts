import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css'
})

export class AddTrip implements OnInit {
  addForm!: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private tripService: TripData
              ) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      nights: [1, [Validators.required, Validators.min(0)]],
      days: [2, [Validators.required, Validators.min(0)]],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
    });

    // Auto-update days when nights changes
    this.addForm.get('nights')!.valueChanges.subscribe((nightsValue: number) => {
      this.addForm.get('days')!.setValue(nightsValue + 1, { emitEvent: false });
    });
  }

  increment(field: 'nights' | 'days'): void {
    const control = this.addForm.get(field)!;
    control.setValue(control.value + 1);
  }

  decrement(field: 'nights' | 'days'): void {
    const control = this.addForm.get(field)!;
    if (control.value > 0) {
      control.setValue(control.value - 1);
    }
  }

  public onSubmit() {
    this.submitted = true;
    if (this.addForm.valid) {
      const formValue = this.addForm.value;
      const length = `${formValue.nights} nights / ${formValue.days} days`;
      const { nights, days, ...rest } = formValue;
      const tripData = { ...rest, length };

      this.tripService.addTrip(tripData)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
    }
  }

  // get the form short name to access the form fields
  get f() { return this.addForm.controls; }
}