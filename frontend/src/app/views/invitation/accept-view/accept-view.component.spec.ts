import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptViewComponent } from './accept-view.component';

describe('AcceptViewComponent', () => {
  let component: AcceptViewComponent;
  let fixture: ComponentFixture<AcceptViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
