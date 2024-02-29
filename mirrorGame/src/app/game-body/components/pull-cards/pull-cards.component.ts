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
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  @Input() hideTheCard!: boolean;
  @Input() allTableCards!: Card[];
  @Output() canPullFromPullCards = new EventEmitter<boolean>();
  @Output() takeTheCardWithoutCheck = new EventEmitter<boolean>();
  splicedCards!: Card[];
  cardToShowToThePlayer!: Card;
  showTheCard: boolean = false;
  cardIndex!: number;
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
    this.cardToShowToThePlayer = card;
    this.cardIndex = index;
  }
  takeTheCard() {
    this.canPullFromPullCards.emit(true);
    this.takeTheCardWithoutCheck.emit(true);
  }

  toGround() {
    const card = this.splicedCards.splice(this.cardIndex, 1)[0];
    this.checkCardTypeForGround(card);
  }

  checkCardTypeForGround(card: Card) {
    if (
      card.content == '7' ||
      card.content == '8' ||
      card.content == '*' ||
      card.content == 'Basra' ||
      card.content == '=><=' ||
      card.content == '9' ||
      card.content == '10'
    ) {
      this.canPullFromPullCards.emit(true);
    } else {
      this.dropTheCardToTheGround(card);
    }
  }
  async dropTheCardToTheGround(card: Card) {
    this.socket.emit('moveTheCard', {
      roomName: this.roomName,
      sourceId: card._id,
      targetId: this.allTableCards[this.allTableCards.length - 1]._id,
    });
    await this.delay();
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
  async delay() {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
