import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitThePlayerComponent } from './wait-the-player.component';

describe('WaitThePlayerComponent', () => {
  let component: WaitThePlayerComponent;
  let fixture: ComponentFixture<WaitThePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitThePlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitThePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
