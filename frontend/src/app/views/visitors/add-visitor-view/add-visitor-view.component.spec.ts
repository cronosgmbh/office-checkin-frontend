import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitorViewComponent } from './add-visitor-view.component';

describe('AddVisitorViewComponent', () => {
  let component: AddVisitorViewComponent;
  let fixture: ComponentFixture<AddVisitorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVisitorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVisitorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
