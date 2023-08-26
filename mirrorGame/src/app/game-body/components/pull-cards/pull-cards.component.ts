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
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  cardToShowToThePlayer: any;
  showTheCard: boolean = false;
  cardIndex!: number;

  constructor() {}

  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
  }
  ngOnChanges(): void {
    console.log(this.Cards);
  }
  showToThePlayer(card: any, index: number) {
    console.log(card);
    this.showTheCard = true;
    this.cardToShowToThePlayer = card;
    this.cardIndex = index;
  }
  takeTheCard() {
    this.Cards.splice(this.cardIndex, 1);
  }
  toGround() {
    this.Cards.splice(this.cardIndex, 1);
    this.socket.emit('deleteCards', {
      gameId: this.gameId,
      cards: this.Cards,
      roomName: this.roomName,
    });
  }
}
