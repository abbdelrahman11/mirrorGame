import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';
import { SocketService } from 'src/app/core/services/socket-service.service';
@Component({
  selector: 'app-main-player',
  templateUrl: './main-player.component.html',
  styleUrls: ['./main-player.component.css'],
})
export class MainPlayerComponent implements OnInit {
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  @Input() playersIndex!: number;
  @Input() Cards!: Card[];
  @Input() canPullFromPullCard!: boolean;
  @Input() canPullFromTheGround!: boolean;
  @Input() showTwoCards!: boolean;
  @Input() selectedPullCard!: Card;
  @Input() allTableCards!: Card[];
  @Input() allPullCards!: Card[];
  @Input() playerNumber!: number;
  @Input() updateTheCard!: boolean;
  @Input() finishTheRound!: number;
  @Input() takeAndGiveSelectedCard!:
    | {
        card: Card;
        playerNumber: number;
        allCard: Card[];
        cardIndex: number;
      }
    | undefined;
  @Output() hideTheCardAndButton = new EventEmitter<boolean>(false);
  @Output() showPlayerCard = new EventEmitter<boolean>(false);
  @Output() takeAndGive = new EventEmitter<boolean>(false);
  @Output() showFourPlayerCard = new EventEmitter<boolean>(false);
  @Output() hideTheButton = new EventEmitter<boolean>(false);
  @Output() changeCanSelectCard = new EventEmitter<boolean>(false);
  @Output() changeCanPullFromTheGround = new EventEmitter<boolean>(false);
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
  TakeOneCardAndGiveOne!: boolean;
  cardIsBasra!: boolean;
  showOneCardFromAllThePlayers!: boolean;
  mainPlayerCard!: Card;
  mainPlayerCardIndex!: number;
  lastPlay!: boolean;
  showEndGame!: boolean;

  constructor(private socket: SocketService) {}
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
    if (!this.updateTheCard && this.canPullFromPullCard) {
      this.checkCardType(this.selectedPullCard);
    }
    if (this.updateTheCard && this.canPullFromPullCard) {
      this.showOneCardOfOtherPlayerCards = !this.updateTheCard;
      this.showOneCardFromAllThePlayers = !this.updateTheCard;
      this.updateTheCards();
    }
    if (this.takeAndGiveSelectedCard) {
      this.TakeOneCardAndGiveFeature(this.takeAndGiveSelectedCard);
    }
  }
  ngOnInit(): void {}

  playerCard(playercard: Card, index: number) {
    if (this.showOneOfYourCard) {
      this.showOneOfYourCardFeature(index);
    }
    if (!this.canPullFromPullCard && !this.canPullFromTheGround) {
      this.showToGroundButton(index, playercard);
    }
    if (this.canPullFromPullCard && this.makeCanPullFromPullCardActive) {
      this.pullFromPullCard(playercard, index);
    }
    if (this.canPullFromTheGround) {
      this.pullFromTheGround(index);
    }
    if (this.cardIsBasra) {
      this.Basra(playercard, index);
    }
    if (this.TakeOneCardAndGiveOne) {
      this.takeAndGive.emit(true);
      this.mainPlayerCard = playercard;
      this.mainPlayerCardIndex = index;
    }
    if (this.showOneCardFromAllThePlayers) {
      this.showOneOfYourCardAndOtherPlayers(index);
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
      this.showOneOfYourCard = true;
    } else if (card.content == '9' || card.content == '10') {
      this.showOneCardOfThePlayer();
    } else if (card.content == '=><=') {
      this.TakeOneCardAndGiveOne = true;
    } else if (card.content == 'Basra') {
      this.cardIsBasra = true;
    } else if (card.content == '*') {
      this.showOneCardFromAllPlayers();
    } else {
      this.makeCanPullFromPullCardActive = true;
    }
  }
  showOneCardOfThePlayer() {
    this.showOneCardOfOtherPlayerCards = true;
    this.showPlayerCard.emit(true);
  }
  showOneCardFromAllPlayers() {
    this.showOneCardFromAllThePlayers = true;
  }

  showOneOfYourCardAndOtherPlayers(index: number) {
    this.flipCardsArray[index] = true;
    setTimeout(() => {
      this.flipCardsArray[index] = false;
    }, 2000);
    this.showFourPlayerCard.emit(true);
  }

  TakeOneCardAndGiveFeature(takeAndGiveSelectedCard: {
    card: Card;
    playerNumber: number;
    allCard: Card[];
    cardIndex: number;
  }) {
    let allPullCardsCopy = [...this.allPullCards];
    const card = allPullCardsCopy.pop();
    if (card) this.allTableCardsCopy.push(card);

    let mainplayerCards = [...this.Cards];
    mainplayerCards[this.mainPlayerCardIndex] = takeAndGiveSelectedCard.card;
    let secondplayerCards = [...takeAndGiveSelectedCard.allCard];
    secondplayerCards[takeAndGiveSelectedCard.cardIndex] = this.mainPlayerCard;

    this.socket.emit('TakeAndGive', {
      gameId: this.gameId,
      roomName: this.roomName,
      mainplayerkeyName: `player${this.playersIndex}`,
      mainplayerCards: mainplayerCards,
      secondplayerkeyName: `player${takeAndGiveSelectedCard.playerNumber}`,
      secondplayerCards: secondplayerCards,
      tableCardsKeyName: 'tableCards',
      pullCardsKeyName: 'pullCards',
      pullCards: allPullCardsCopy,
      TableCards: this.allTableCardsCopy,
    });
    this.TakeOneCardAndGiveOne = false;
    this.takeAndGiveSelectedCard = undefined;
    this.changeCanSelectCard.emit(false);
    this.hideTheCardAndButton.emit(true);
    this.takeAndGive.emit(false);
  }
  async Basra(playercard: Card, index: number) {
    let allPullCardsCopy = [...this.allPullCards];
    const card = allPullCardsCopy.pop();
    if (card) this.allTableCardsCopy.push(card);
    this.allTableCardsCopy.push(playercard);
    this.Cards.splice(index, 1);
    this.socket.emit('Basra', {
      gameId: this.gameId,
      roomName: this.roomName,
      playerCards: this.Cards,
      TableCards: this.allTableCardsCopy,
      playerkeyName: `player${this.playersIndex}`,
      tableCardsKeyName: 'tableCards',
      pullCardsKeyName: 'pullCards',
      pullCards: allPullCardsCopy,
    });
    this.cardIsBasra = false;
    this.changeCanSelectCard.emit(false);
    this.hideTheCardAndButton.emit(true);
  }

  updateTheCards() {
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
  showOneOfYourCardFeature(index: number) {
    this.flipCardsArray[index] = true;
    setTimeout(() => {
      this.flipCardsArray[index] = false;
      this.showOneOfYourCard = false;
      this.updateTheCards();
    }, 2000);
  }

  roundFinished() {
    this.socket.emit('roundFinished', {
      gameId: this.gameId,
      roomName: this.roomName,
    });
  }
}
