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
  @Input() PullCards!: Card[];
  @Input() canPullFromPullCard!: boolean;
  @Input() canPullFromTheGround!: boolean;
  @Input() showTwoCards!: boolean;
  @Input() selectedPullCard!: Card;
  // @Input() selectedTableCard!: Card;
  // @Input() tableCards!: Card[];
  @Input() allTableCards!: Card[];
  @Input() allPullCards!: Card[];
  @Output() hideTheCardAndButton = new EventEmitter<boolean>(false);
  @Output() hideTheButton = new EventEmitter<boolean>(false);
  @Output() changeCanSelectCard = new EventEmitter<boolean>(false);
  @Output() changeCanPullFromTheGround = new EventEmitter<boolean>(false);
  @Input() playerNumber!: number;
  copyOfPlayerCards!: Card[];
  flipCardsArray: Array<boolean> = [];
  showToGround!: boolean;
  showSelectedCard: Array<boolean> = [];
  playerCardToCheck!: Card;
  allTableCardsCopy!: Card[];
  playerCardToCheckInex!: number;
  makeCanPullFromPullCardActive!: boolean;
  showOneOfYourCard!: boolean;
  showOneCardOfOtherPlayerCards!: boolean;
  TakeOneCardAndGiveOne: boolean = true;
  cardIsBasra!: boolean;
  showOneCardFromAllThePlayers!: boolean;

  constructor() {}
  ngOnChanges(): void {
    if (this.Cards) {
      this.copyOfPlayerCards = [...this.Cards];
    }

    if (this.showTwoCards) {
      this.showTwoCardsToThePlayer();
    }
    if (this.allTableCards) {
      this.allTableCardsCopy = [...this.allTableCards];
    }
    if (this.canPullFromPullCard) {
      this.checkCardType(this.selectedPullCard);
    }
  }
  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
  }

  playerCard(playercard: Card, index: number) {
    if (!this.canPullFromPullCard && !this.canPullFromTheGround) {
      this.showToGroundButton(index, playercard);
    }
    if (this.canPullFromPullCard && this.makeCanPullFromPullCardActive) {
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

  pullFromPullCard(selectedplayercard: Card, index: number) {
    this.copyOfPlayerCards[index] = this.selectedPullCard;
    let allPullCardsCopy = [...this.allPullCards];
    const card = allPullCardsCopy.pop();
    this.socket.emit('playerTakesCard', {
      gameId: this.gameId,
      roomName: this.roomName,
      playercards: this.copyOfPlayerCards,
      playerkeyName: `player${this.playersIndex}`,
      PullCards: allPullCardsCopy,
      tableCards: selectedplayercard,
      PullCardsKeyName: 'pullCards',
      tableCardsKeyName: 'tableCards',
    });
    this.makeCanPullFromPullCardActive = false;
    this.changeCanSelectCard.emit(false);
    this.hideTheCardAndButton.emit(true);
  }

  pullFromTheGround(index: number) {
    let tableCardsCopy = [...this.allTableCards];
    let card = tableCardsCopy.pop();
    tableCardsCopy.push(this.copyOfPlayerCards[index]);
    if (card) this.copyOfPlayerCards[index] = card;
    this.socket.emit('playerTakesCardFromGround', {
      gameId: this.gameId,
      roomName: this.roomName,
      playercards: this.copyOfPlayerCards,
      playerkeyName: `player${this.playersIndex}`,
      tableCards: tableCardsCopy,
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
  checkCardType(card: Card) {
    if (card.content == '7' || card.content == '8') {
      this.showOneOfYourCards();
    } else if (card.content == '9' || card.content == '10') {
      this.showOneCardOfThePlayer();
    } else if (card.content == '=><=') {
      this.TakeOneCardAndGive();
    } else if (card.content == 'Basra') {
      this.Basra();
    } else if (card.content == '*') {
      this.showCardFromAllThePlayers();
    } else {
      this.makeCanPullFromPullCardActive = true;
    }
  }
  cardsFeatures() {
    let allPullCardsCopy = [...this.allPullCards];
    const card = allPullCardsCopy.pop();
    this.socket.emit('fromPullCardsToTable', {
      gameId: this.gameId,
      deleteCards: allPullCardsCopy,
      addCards: card,
      roomName: this.roomName,
      deleteKeyName: 'pullCards',
      addKeyName: 'tableCards',
    });
    this.changeCanSelectCard.emit(false);
    this.hideTheCardAndButton.emit(true);
  }
  showOneOfYourCards() {
    console.log('showOneOfYourCards');
    this.showOneOfYourCard = true;
    this.cardsFeatures();
  }
  showOneCardOfThePlayer() {
    console.log('showOneCardOfOtherPlayer()');
    this.showOneCardOfOtherPlayerCards = true;
    this.cardsFeatures();
  }
  TakeOneCardAndGive() {
    console.log('TakeOneCardAndGive()');
    this.TakeOneCardAndGiveOne = true;
    this.cardsFeatures();
  }
  Basra() {
    console.log('Basra');
    this.cardIsBasra = true;
    this.cardsFeatures();
  }
  showCardFromAllThePlayers() {
    console.log('showCardFromAllThePlayers');
    this.showOneCardFromAllThePlayers = true;
    this.cardsFeatures();
  }
}
