import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SayMirrorComponent } from './say-mirror.component';

describe('SayMirrorComponent', () => {
  let component: SayMirrorComponent;
  let fixture: ComponentFixture<SayMirrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SayMirrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SayMirrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
