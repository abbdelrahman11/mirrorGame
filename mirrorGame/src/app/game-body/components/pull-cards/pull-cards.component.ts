import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';
import { SocketService } from 'src/app/core/services/socket-service.service';

@Component({
  selector: 'app-pull-cards',
  templateUrl: './pull-cards.component.html',
  styleUrls: ['./pull-cards.component.css'],
})
export class PullCardsComponent implements OnInit {
  @Input() Cards!: Card[] | [];
  splicedCards!: Card[];
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  @Input() hideTheCard!: boolean;
  @Output() canPullFromPullCards = new EventEmitter<boolean>();
  @Output() selectedCard = new EventEmitter<Card>();
  cardToShowToThePlayer!: Card;
  showTheCard: boolean = false;
  cardIndex!: number;
  showButtons: boolean = true;
  constructor(private socket: SocketService) {}

  ngOnInit(): void {
    this.hideThCard();
  }
  ngOnChanges(): void {
    if (this.Cards) {
      this.splicedCards = [...this.Cards];
    }
    if (this.hideTheCard) {
      this.showTheCard = !this.hideTheCard;
    }
  }

  showToThePlayer(card: Card, index: number) {
    this.showTheCard = true;
    this.showButtons = true;
    this.cardToShowToThePlayer = card;
    this.cardIndex = index;
  }
  takeTheCard() {
    this.canPullFromPullCards.emit(true);
    const card = this.splicedCards.splice(this.cardIndex, 1)[0];
    this.selectedCard.emit(card);
    this.showButtons = false;
  }
  toGround() {
    const card = this.splicedCards.splice(this.cardIndex, 1)[0];
    this.socket.emit('fromPullCardsToTable', {
      gameId: this.gameId,
      deleteCards: this.splicedCards,
      addCards: card,
      roomName: this.roomName,
      deleteKeyName: 'pullCards',
      addKeyName: 'tableCards',
    });
    this.hideThCard();
  }
  hideThCard() {
    this.showTheCard = false;
  }
}
