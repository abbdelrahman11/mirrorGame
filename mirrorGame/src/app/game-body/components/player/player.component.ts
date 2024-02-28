import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';
import { User } from 'src/app/core/interfaces/user';
import { SocketService } from 'src/app/core/services/socket-service.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  @Input() playerCard!: Card[];
  @Input() playerNumber!: number;
  @Input() activePlayerNumber!: number;
  @Input() showPlayerCards!: boolean;
  @Input() takeAndGive!: boolean;
  @Input() showFourPlayerCards!: boolean;
  @Input() counterUpdatedForPlayers!: number;
  @Input() playersInfo!: User[];
  @Input() isSmallScreen!: boolean;
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  @Output() onShowPlayerCardChange = new EventEmitter<boolean>(false);
  @Output() updateCounterForPlayers = new EventEmitter<number>();
  @Output() onshowFourPlayerCardsChange = new EventEmitter<boolean>(false);
  @Output() updateTheCards = new EventEmitter<boolean>(false);
  @Output() takeAndGiveSelectedCard = new EventEmitter<{
    allCard: Card[];
    card: Card;
    playerNumber: number;
    cardIndex: number;
  }>();
  flipCardsArray: Array<boolean> = [];
  counter!: number;
  clickedCards: number[] = [];

  constructor(private socket: SocketService) {}

  ngOnChanges() {}
  ngOnInit(): void {}
  CardChecked(index: number, card: Card) {
    if (this.showPlayerCards) {
      this.showOneOfYourCardFeature(index, card);
    }
    if (this.showFourPlayerCards) {
      this.showFourPlayerCardsFeature(index, this.playerNumber, card);
    }
    if (this.takeAndGive) {
      this.takeAndGiveCard(index, this.playerNumber);
    }
  }
  showOneOfYourCardFeature(index: number, card: Card) {
    this.socket.emit('flipTheCard', {
      gameId: this.gameId,
      roomName: this.roomName,
      cardId: card._id,
    });
    this.flipCardsArray[index] = true;
    this.onShowPlayerCardChange.emit(false);
    setTimeout(() => {
      this.flipCardsArray[index] = false;
      this.updateTheCards.emit(true);
    }, 2000);
  }

  showFourPlayerCardsFeature(index: number, playerNumber: number, card: Card) {
    this.counter = this.counterUpdatedForPlayers;
    if (!this.clickedCards.includes(playerNumber)) {
      this.counter++;
      this.updateCounterForPlayers.emit(this.counter | 0);
      if (this.counter != 2) {
        this.clickedCards.push(playerNumber);
        this.socket.emit('flipTheCard', {
          gameId: this.gameId,
          roomName: this.roomName,
          cardId: card._id,
        });
        this.flipCardsArray[index] = true;
        setTimeout(() => {
          this.flipCardsArray[index] = false;
        }, 2000);
      } else {
        this.socket.emit('flipTheCard', {
          gameId: this.gameId,
          roomName: this.roomName,
          cardId: card._id,
        });
        this.flipCardsArray[index] = true;
        this.onshowFourPlayerCardsChange.emit(false);
        setTimeout(() => {
          this.flipCardsArray[index] = false;
          this.updateTheCards.emit(true);
        }, 2000);
      }
    }
  }

  takeAndGiveCard(index: number, playerNumber: number) {
    this.takeAndGiveSelectedCard.emit({
      allCard: this.playerCard,
      card: this.playerCard[index],
      playerNumber,
      cardIndex: index,
    });
    // something is here check it
  }
}
