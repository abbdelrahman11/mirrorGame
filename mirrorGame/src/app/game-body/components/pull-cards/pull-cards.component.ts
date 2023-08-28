import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';
import * as socketIO from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pull-cards',
  templateUrl: './pull-cards.component.html',
  styleUrls: ['./pull-cards.component.css'],
})
export class PullCardsComponent implements OnInit {
  private socket!: socketIO.Socket;
  @Input() Cards!: Card[] | [];
  splicedCards!: Card[];
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  cardToShowToThePlayer!: Card;
  showTheCard: boolean = false;
  cardIndex!: number;

  constructor() {}

  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
  }
  ngOnChanges(): void {
    if (this.Cards) {
      this.splicedCards = [...this.Cards];
    }
  }
  showToThePlayer(card: any, index: number) {
    this.showTheCard = true;
    this.cardToShowToThePlayer = card;
    this.cardIndex = index;
  }
  takeTheCard() {
    this.splicedCards.splice(this.cardIndex, 1);
  }
  toGround() {
    const card = this.splicedCards.splice(this.cardIndex, 1)[0];
    this.showTheCard = false;
    this.socket.emit('deleteCards', {
      gameId: this.gameId,
      cards: this.splicedCards,
      roomName: this.roomName,
      keyName: 'pullCards',
    });
    this.socket.emit('addCard', {
      gameId: this.gameId,
      card: card,
      roomName: this.roomName,
      keyName: 'tableCards',
    });
  }
}
