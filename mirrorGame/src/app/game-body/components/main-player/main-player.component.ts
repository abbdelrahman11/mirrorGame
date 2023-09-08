import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';
import * as socketIO from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-main-player',
  templateUrl: './main-player.component.html',
  styleUrls: ['./main-player.component.css'],
})
export class MainPlayerComponent implements OnInit {
  private socket!: socketIO.Socket;
  @Input() Cards!: Card[];
  @Input() PullCards!: Card[];
  @Input() canSelectCard!: boolean;
  @Input() selectedPullCard!: Card;
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  @Input() playersIndex!: number;
  @Output() hideTheCard = new EventEmitter<boolean>(false);
  playercard!: Card;
  @Output() changeCanSelectCard: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
  }

  playerCard(playercard: Card, index: number) {
    if (this.canSelectCard) {
      this.playercard = playercard;
      this.Cards[index] = this.selectedPullCard;
      this.socket.emit('playerTakesCard', {
        gameId: this.gameId,
        roomName: this.roomName,
        playercards: this.Cards,
        playerkeyName: `player${this.playersIndex}`,
        PullCards: this.PullCards,
        tableCards: this.playercard,
        PullCardsKeyName: 'pullCards',
        tableCardsKeyName: 'tableCards',
      });
      this.canSelectCard = false;
      this.changeCanSelectCard.emit(this.canSelectCard);
      this.hideTheCard.emit(true);
    }
  }
}
