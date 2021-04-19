import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsOverviewComponent } from './bookings-overview.component';

describe('BookingsOverviewComponent', () => {
  let component: BookingsOverviewComponent;
  let fixture: ComponentFixture<BookingsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
