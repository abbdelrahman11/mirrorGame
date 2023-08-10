import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomBodyComponent } from './room-body.component';

describe('RoomBodyComponent', () => {
  let component: RoomBodyComponent;
  let fixture: ComponentFixture<RoomBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
