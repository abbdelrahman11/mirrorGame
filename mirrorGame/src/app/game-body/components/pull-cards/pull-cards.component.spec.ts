import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullCardsComponent } from './pull-cards.component';

describe('PullCardsComponent', () => {
  let component: PullCardsComponent;
  let fixture: ComponentFixture<PullCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PullCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
