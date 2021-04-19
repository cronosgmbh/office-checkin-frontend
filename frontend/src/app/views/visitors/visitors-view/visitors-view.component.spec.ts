import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorsViewComponent } from './visitors-view.component';

describe('VisitorsViewComponent', () => {
  let component: VisitorsViewComponent;
  let fixture: ComponentFixture<VisitorsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
