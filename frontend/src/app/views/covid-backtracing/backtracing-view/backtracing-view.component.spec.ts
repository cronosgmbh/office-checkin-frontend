import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacktracingViewComponent } from './backtracing-view.component';

describe('BacktracingViewComponent', () => {
  let component: BacktracingViewComponent;
  let fixture: ComponentFixture<BacktracingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacktracingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacktracingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
