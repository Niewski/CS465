import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrip } from './add-trip';

describe('AddTrip', () => {
  let component: AddTrip;
  let fixture: ComponentFixture<AddTrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize nights to 1 and days to 2', () => {
    expect(component.addForm.get('nights')!.value).toBe(1);
    expect(component.addForm.get('days')!.value).toBe(2);
  });

  it('should auto-update days when nights changes', () => {
    component.addForm.get('nights')!.setValue(5);
    expect(component.addForm.get('days')!.value).toBe(6);
  });

  it('should increment nights', () => {
    component.increment('nights');
    expect(component.addForm.get('nights')!.value).toBe(2);
  });

  it('should decrement nights but not below 0', () => {
    component.addForm.get('nights')!.setValue(0, { emitEvent: false });
    component.decrement('nights');
    expect(component.addForm.get('nights')!.value).toBe(0);
  });

  it('should increment days', () => {
    component.addForm.get('days')!.setValue(3, { emitEvent: false });
    component.increment('days');
    expect(component.addForm.get('days')!.value).toBe(4);
  });

  it('should decrement days but not below 0', () => {
    component.addForm.get('days')!.setValue(0, { emitEvent: false });
    component.decrement('days');
    expect(component.addForm.get('days')!.value).toBe(0);
  });
});
