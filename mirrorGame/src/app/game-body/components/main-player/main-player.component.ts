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
  @Input() canSelectCard!: boolean;
  @Input() selectedPullCard!: Card;
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  @Input() playersIndex!: number;
  @Output() updatePullCards = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
  }
  ngOnChanges(): void {
    // console.log(this.canSelectCard);
    // console.log(this.selectedPullCard);
  }
  playerCard(playercard: Card, index: number) {
    this.Cards[index] = this.selectedPullCard;
    this.updatePullCards.emit(true);
    // this.socket.emit('updatePlayerCards', {
    //   gameId: this.gameId,
    //   roomName: this.roomName,
    //   cards: this.Cards,
    //   keyName: `player${this.playersIndex}`,
    // });
  }
}
