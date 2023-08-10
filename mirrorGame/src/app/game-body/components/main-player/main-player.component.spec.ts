import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPlayerComponent } from './main-player.component';

describe('MainPlayerComponent', () => {
  let component: MainPlayerComponent;
  let fixture: ComponentFixture<MainPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
