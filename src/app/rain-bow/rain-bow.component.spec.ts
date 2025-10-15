import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainBowComponent } from './rain-bow.component';

describe('RainBowComponent', () => {
  let component: RainBowComponent;
  let fixture: ComponentFixture<RainBowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RainBowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RainBowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
