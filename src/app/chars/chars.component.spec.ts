import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharsComponent } from './chars.component';

describe('CharsComponent', () => {
  let component: CharsComponent;
  let fixture: ComponentFixture<CharsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
