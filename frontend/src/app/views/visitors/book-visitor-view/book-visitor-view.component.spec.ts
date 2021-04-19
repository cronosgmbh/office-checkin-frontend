import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookVisitorViewComponent } from './book-visitor-view.component';

describe('BookVisitorViewComponent', () => {
  let component: BookVisitorViewComponent;
  let fixture: ComponentFixture<BookVisitorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookVisitorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookVisitorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
