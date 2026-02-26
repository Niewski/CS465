import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrip } from './edit-trip';

describe('EditTrip', () => {
  let component: EditTrip;
  let fixture: ComponentFixture<EditTrip>;

  beforeEach(async () => {
    // Provide a tripCode in localStorage so ngOnInit doesn't bail out
    localStorage.setItem('tripCode', 'TEST');

    await TestBed.configureTestingModule({
      imports: [EditTrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.removeItem('tripCode');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize nights to 1 and days to 2 by default', () => {
    expect(component.editForm.get('nights')!.value).toBe(1);
    expect(component.editForm.get('days')!.value).toBe(2);
  });

  it('should auto-update days when nights changes', () => {
    component.editForm.get('nights')!.setValue(5);
    expect(component.editForm.get('days')!.value).toBe(6);
  });

  it('should increment nights', () => {
    component.increment('nights');
    expect(component.editForm.get('nights')!.value).toBe(2);
  });

  it('should decrement nights but not below 0', () => {
    component.editForm.get('nights')!.setValue(0, { emitEvent: false });
    component.decrement('nights');
    expect(component.editForm.get('nights')!.value).toBe(0);
  });

  it('should increment days', () => {
    component.editForm.get('days')!.setValue(3, { emitEvent: false });
    component.increment('days');
    expect(component.editForm.get('days')!.value).toBe(4);
  });

  it('should decrement days but not below 0', () => {
    component.editForm.get('days')!.setValue(0, { emitEvent: false });
    component.decrement('days');
    expect(component.editForm.get('days')!.value).toBe(0);
  });
});
