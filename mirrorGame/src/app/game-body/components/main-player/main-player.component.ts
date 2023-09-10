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
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  @Input() playersIndex!: number;
  @Input() Cards!: Card[];
  @Input() copyOfCards!: Card[];
  @Input() PullCards!: Card[];
  @Input() canPullFromPullCard!: boolean;
  @Input() canPullFromTheGround!: boolean;
  @Input() selectedPullCard!: Card;
  @Input() selectedTableCard!: Card;
  @Input() tableCards!: Card[];
  @Output() hideTheCard = new EventEmitter<boolean>(false);
  @Output() hideTheButton = new EventEmitter<boolean>(false);
  @Output() changeCanSelectCard = new EventEmitter<boolean>(false);
  @Output() changeCanPullFromTheGround = new EventEmitter<boolean>(false);

  constructor() {}
  ngOnChanges(): void {
    if (this.Cards) {
      this.copyOfCards = [...this.Cards];
    }
  }

  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
  }

  playerCard(playercard: Card, index: number) {
    if (this.canPullFromPullCard) {
      this.copyOfCards[index] = this.selectedPullCard;
      this.socket.emit('playerTakesCard', {
        gameId: this.gameId,
        roomName: this.roomName,
        playercards: this.copyOfCards,
        playerkeyName: `player${this.playersIndex}`,
        PullCards: this.PullCards,
        tableCards: playercard,
        PullCardsKeyName: 'pullCards',
        tableCardsKeyName: 'tableCards',
      });
      this.canPullFromPullCard = false;
      this.changeCanSelectCard.emit(this.canPullFromPullCard);
      this.hideTheCard.emit(true);
    }
    if (this.canPullFromTheGround) {
      this.tableCards.push(this.copyOfCards[index]);
      this.copyOfCards[index] = this.selectedTableCard;
      this.socket.emit('playerTakesCardFromGround', {
        gameId: this.gameId,
        roomName: this.roomName,
        playercards: this.copyOfCards,
        playerkeyName: `player${this.playersIndex}`,
        tableCards: this.tableCards,
        tableCardsKeyName: 'tableCards',
      });
      this.canPullFromTheGround = false;
      this.changeCanPullFromTheGround.emit(this.canPullFromTheGround);
      this.hideTheButton.emit(true);
    }
  }
}
