import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';

@Component({
  selector: 'app-table-cards',
  templateUrl: './table-cards.component.html',
  styleUrls: ['./table-cards.component.css'],
})
export class TableCardsComponent implements OnInit {
  @Input() Cards!: Card[];
  @Input() hideTheButton!: boolean;
  @Output() selectedTableCard = new EventEmitter<Card>();
  @Output() allTableCards = new EventEmitter<Card[]>();
  @Output() canPullFromGround = new EventEmitter<boolean>();
  cardIndex!: number;
  splicedCards!: Card[];
  showTakeButton!: boolean;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    if (this.Cards) {
      this.splicedCards = [...this.Cards];
    }
    if (this.hideTheButton) {
      this.showTakeButton = !this.hideTheButton;
    }
  }
  playerCard(index: number) {
    this.showTakeButton = true;
    this.cardIndex = index;
  }
  takeTheCard() {
    this.canPullFromGround.emit(true);
    const card = this.splicedCards.splice(this.cardIndex, 1)[0];
    this.selectedTableCard.emit(card);
    this.allTableCards.emit(this.splicedCards);
  }
}
