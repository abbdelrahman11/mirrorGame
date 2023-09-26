import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerstatusComponent } from './playerstatus.component';

describe('PlayerstatusComponent', () => {
  let component: PlayerstatusComponent;
  let fixture: ComponentFixture<PlayerstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerstatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
