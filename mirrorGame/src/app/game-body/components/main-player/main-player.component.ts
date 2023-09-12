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
  @Input() showTwoCards!: boolean;
  @Input() selectedPullCard!: Card;
  @Input() selectedTableCard!: Card;
  @Input() tableCards!: Card[];
  @Input() allTableCards!: Card[];
  @Output() hideTheCard = new EventEmitter<boolean>(false);
  @Output() hideTheButton = new EventEmitter<boolean>(false);
  @Output() changeCanSelectCard = new EventEmitter<boolean>(false);
  @Output() changeCanPullFromTheGround = new EventEmitter<boolean>(false);
  @Input() playerNumber!: number;
  flipCardsArray: Array<boolean> = [];
  showToGround!: boolean;
  showSelectedCard: Array<boolean> = [];
  playerCardToCheck!: Card;
  allTableCardsCopy!: Card[];
  playerCardToCheckInex!: number;

  constructor() {}
  ngOnChanges(): void {
    if (this.Cards) {
      this.copyOfCards = [...this.Cards];
    }

    if (this.showTwoCards) {
      this.showTwoCardsToThePlayer();
    }
    if (this.allTableCards) {
      this.allTableCardsCopy = [...this.allTableCards];
    }
  }

  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
  }

  playerCard(playercard: Card, index: number) {
    if (!this.canPullFromPullCard && !this.canPullFromTheGround)
      this.showToGroundButton(index, playercard);
    if (this.canPullFromPullCard) {
      this.pullFromPullCard(playercard, index);
    }
    if (this.canPullFromTheGround) {
      this.pullFromTheGround(index);
    }
  }
  showToGroundButton(index: number, playercard: Card) {
    if (this.showSelectedCard.every((element) => element === false)) {
      this.showSelectedCard[index] = true;
      this.showToGround = true;
      this.playerCardToCheck = playercard;
      this.playerCardToCheckInex = index;
    }
  }
  pullFromPullCard(playercard: Card, index: number) {
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

  pullFromTheGround(index: number) {
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

  showTwoCardsToThePlayer() {
    this.flipCardsArray[0] = true;
    this.flipCardsArray[1] = true;
    setTimeout(() => {
      this.socket.emit('chandeshowTwoCardsValue', {
        gameId: this.gameId,
        value: false,
        playersIndex: this.playersIndex,
      });
      this.flipCardsArray[0] = false;
      this.flipCardsArray[1] = false;
    }, 5000);
  }
  checkIfValuesAreEquals() {
    const tableCard = this.allTableCardsCopy.pop();
    if (this.playerCardToCheck.content == tableCard?.content) {
      this.ValuesAreEquals(tableCard);
    } else {
      this.ValuesAreNotEquals(tableCard);
    }
  }
  ValuesAreEquals(tableCard: Card) {
    this.allTableCardsCopy.push(tableCard);
    this.allTableCardsCopy.push(tableCard);
    this.Cards.splice(this.playerCardToCheckInex, 1);
    this.showSelectedCard[this.playerCardToCheckInex] = false;
    this.showToGround = false;
    this.socket.emit('updatePlayerCards', {
      gameId: this.gameId,
      roomName: this.roomName,
      playerCards: this.Cards,
      TableCards: this.allTableCardsCopy,
      playerkeyName: `player${this.playersIndex}`,
      tableCardsKeyName: 'tableCards',
    });
  }
  ValuesAreNotEquals(tableCard?: Card) {
    if (tableCard) this.Cards.push(tableCard);
    this.showSelectedCard[this.playerCardToCheckInex] = false;
    this.showToGround = false;
    this.socket.emit('updatePlayerCards', {
      gameId: this.gameId,
      roomName: this.roomName,
      playerCards: this.Cards,
      TableCards: this.allTableCardsCopy,
      playerkeyName: `player${this.playersIndex}`,
      tableCardsKeyName: 'tableCards',
    });
  }
}
