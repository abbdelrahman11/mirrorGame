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
  @Input() Cards!: Card[];
  splicedCards!: Card[];
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  cardToShowToThePlayer: any;
  showTheCard: boolean = false;
  cardIndex!: number;

  constructor() {}

  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
    this.socket.on('cardDeleted', (res) => {
      if (res) {
        this.showTheCard = false;
        this.Cards.splice(this.cardIndex, 1);
      }
    });
  }
  ngOnChanges(): void {
    this.splicedCards = [...this.Cards];
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
    this.splicedCards.splice(this.cardIndex, 1);
    console.log(this.Cards);
    this.socket.emit('deleteCards', {
      gameId: this.gameId,
      cards: this.splicedCards,
      roomName: this.roomName,
    });
  }
}
