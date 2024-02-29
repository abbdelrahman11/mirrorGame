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
  @Input() takeTheCardWithoutCheck!: boolean;
  @Input() canPullFromTheGround!: boolean;
  @Input() showTwoCards!: boolean;
  @Input() allTableCards!: Card[];
  @Input() allPullCards!: Card[];
  @Input() playerNumber!: number;
  @Input() updateTheCard!: boolean;
  @Input() finishTheRound!: number;
  @Input() roomPoints!: number;
  @Input() playerName!: string | undefined;
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
  @Output() changeTakeTheCardWithoutCheck = new EventEmitter<boolean>(false);
  @Output() changeCanPullFromTheGround = new EventEmitter<boolean>(false);
  @Output() changeupdateTheCard = new EventEmitter<boolean>(false);
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
  blockRoundFinishedButton!: boolean;

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
      let allPullCardsCopy = [...this.allPullCards];
      const card: any = allPullCardsCopy.pop();
      this.checkCardType(card);
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
  ngOnInit(): void {
    this.socket.listen('moveTheCards').subscribe((res: any) => {
      this.moveTheCard(res.sourceId, res.targetId);
    });
    this.socket.listen('flipTheCards').subscribe((res: any) => {
      this.flipTheCard(res);
    });
  }

  playerCard(playercard: Card, Cardindex: number) {
    if (this.showOneOfYourCard) {
      this.showOneOfYourCardFeature(playercard, Cardindex);
    }
    if (!this.canPullFromPullCard && !this.canPullFromTheGround) {
      this.showToGroundButton(Cardindex, playercard);
    }
    if (this.canPullFromPullCard && this.makeCanPullFromPullCardActive) {
      this.pullFromPullCard(playercard, Cardindex);
    }
    if (this.canPullFromTheGround) {
      this.pullFromTheGround(Cardindex);
    }
    if (this.cardIsBasra) {
      this.Basra(playercard, Cardindex);
    }
    if (this.TakeOneCardAndGiveOne) {
      this.takeAndGive.emit(true);
      this.mainPlayerCard = playercard;
      this.mainPlayerCardIndex = Cardindex;
    }
    if (this.showOneCardFromAllThePlayers) {
      this.showOneOfYourCardAndOtherPlayers(Cardindex, playercard);
    }
  }
  showToGroundButton(Cardindex: number, playercard: Card) {
    if (this.showSelectedCard.every((element) => element === false)) {
      this.showSelectedCard[Cardindex] = true;
      this.showToGround = true;
      this.playerCardToCheck = playercard;
      this.playerCardToCheckInex = Cardindex;
    }
  }

  async pullFromPullCard(selectedplayercard: Card, Cardindex: number) {
    let allPullCardsCopy = [...this.allPullCards];
    const card: any = allPullCardsCopy.pop();
    this.copyOfPlayerCards[Cardindex] = card;
    this.makeCanPullFromPullCardActive = false;
    this.MoveTheCards(this.allPullCards[0]._id, selectedplayercard._id);
    this.MoveTheCards(
      selectedplayercard._id,
      this.allTableCards[this.allTableCards.length - 1]._id
    );
    await this.delay();
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
    this.changeCanSelectCard.emit(false);
    this.hideTheCardAndButton.emit(true);
    this.changeTakeTheCardWithoutCheck.emit(false);
  }

  async pullFromTheGround(Cardindex: number) {
    this.MoveTheCards(
      this.allTableCards[this.allTableCards.length - 1]._id,
      this.copyOfPlayerCards[Cardindex]._id
    );
    this.MoveTheCards(
      this.copyOfPlayerCards[Cardindex]._id,
      this.allTableCards[this.allTableCards.length - 1]._id
    );
    await this.delay();
    let tableCardsCopy = [...this.allTableCards];
    let card = tableCardsCopy.pop();
    tableCardsCopy.push(this.copyOfPlayerCards[Cardindex]);
    if (card) this.copyOfPlayerCards[Cardindex] = card;

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
    this.socket.emit('chandeshowTwoCardsValue', {
      gameId: this.gameId,
      value: false,
      playersIndex: this.playersIndex,
    });
    this.flipCardsArray[0] = true;
    this.flipCardsArray[1] = true;
    setTimeout(() => {
      this.flipCardsArray[0] = false;
      this.flipCardsArray[1] = false;
    }, 6000);
  }
  checkIfValuesAreEquals() {
    const tableCard = this.allTableCardsCopy.pop();
    if (this.playerCardToCheck.content == tableCard?.content) {
      this.ValuesAreEquals(tableCard);
    } else {
      this.ValuesAreNotEquals(tableCard);
    }
  }
  async ValuesAreEquals(tableCard: Card) {
    this.allTableCardsCopy.push(tableCard);
    this.allTableCardsCopy.push(tableCard);
    let copyOfCards = [...this.Cards];
    copyOfCards.splice(this.playerCardToCheckInex, 1);
    this.showSelectedCard[this.playerCardToCheckInex] = false;
    this.showToGround = false;
    this.MoveTheCards(
      this.Cards[this.playerCardToCheckInex]._id,
      this.allTableCards[this.allTableCards.length - 1]._id
    );
    await this.delay();
    this.socket.emit('updatePlayerCards', {
      gameId: this.gameId,
      roomName: this.roomName,
      playerCards: copyOfCards,
      TableCards: this.allTableCardsCopy,
      playerkeyName: `player${this.playersIndex}`,
      tableCardsKeyName: 'tableCards',
    });
  }
  async ValuesAreNotEquals(tableCard?: Card) {
    if (tableCard) this.Cards.push(tableCard);
    this.showSelectedCard[this.playerCardToCheckInex] = false;
    this.showToGround = false;

    this.MoveTheCards(
      this.Cards[this.playerCardToCheckInex]._id,
      this.allTableCards[this.allTableCards.length - 1]._id
    );
    await this.delay();
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
    if (this.takeTheCardWithoutCheck) {
      this.makeCanPullFromPullCardActive = true;
    } else {
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
      }
    }
  }
  showOneCardOfThePlayer() {
    this.showOneCardOfOtherPlayerCards = true;
    this.showPlayerCard.emit(true);
  }
  showOneCardFromAllPlayers() {
    this.showOneCardFromAllThePlayers = true;
  }

  showOneOfYourCardAndOtherPlayers(Cardindex: number, card: Card) {
    this.socket.emit('flipTheCard', {
      gameId: this.gameId,
      roomName: this.roomName,
      cardId: card._id,
    });
    this.flipCardsArray[Cardindex] = true;
    setTimeout(() => {
      this.flipCardsArray[Cardindex] = false;
    }, 2000);
    this.showFourPlayerCard.emit(true);
  }

  async TakeOneCardAndGiveFeature(takeAndGiveSelectedCard: {
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

    this.MoveTheCards(
      takeAndGiveSelectedCard.card._id,
      this.Cards[this.mainPlayerCardIndex]._id
    );
    this.MoveTheCards(
      this.Cards[this.mainPlayerCardIndex]._id,
      takeAndGiveSelectedCard.card._id
    );
    this.MoveTheCards(
      this.allPullCards[0]._id,
      this.allTableCards[this.allTableCards.length - 1]._id
    );
    await this.delay();
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
  async Basra(playercard: Card, Cardindex: number) {
    let allPullCardsCopy = [...this.allPullCards];
    const card = allPullCardsCopy.pop();
    if (card) this.allTableCardsCopy.push(card);
    this.allTableCardsCopy.push(playercard);
    let CardsCopy = [...this.Cards];
    CardsCopy.splice(Cardindex, 1);
    this.MoveTheCards(
      this.allPullCards[0]._id,
      this.allTableCards[this.allTableCards.length - 1]._id
    );
    this.MoveTheCards(
      playercard._id,
      this.allTableCards[this.allTableCards.length - 1]._id
    );
    await this.delay();
    this.socket.emit('Basra', {
      gameId: this.gameId,
      roomName: this.roomName,
      playerCards: CardsCopy,
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

  async updateTheCards() {
    let allPullCardsCopy = [...this.allPullCards];
    const card = allPullCardsCopy.pop();

    this.MoveTheCards(
      this.allPullCards[0]._id,
      this.allTableCards[this.allTableCards.length - 1]._id
    );
    await this.delay();
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
    this.changeupdateTheCard.emit(false);
  }
  showOneOfYourCardFeature(playercard: Card, Cardindex: number) {
    this.flipCardsArray[Cardindex] = true;
    this.socket.emit('flipTheCard', {
      gameId: this.gameId,
      roomName: this.roomName,
      cardId: playercard._id,
    });
    setTimeout(() => {
      this.flipCardsArray[Cardindex] = false;
      this.showOneOfYourCard = false;
      this.updateTheCards();
    }, 2000);
  }

  roundFinished() {
    this.socket.emit('roundFinished', {
      gameId: this.gameId,
      roomName: this.roomName,
      roomPoints: this.roomPoints,
    });
    this.blockRoundFinishedButton = true;
  }
  flipTheCard(cardrId: string) {
    let cardDiv: any = document.getElementById(cardrId);
    cardDiv.classList.add('flip-back');
    setTimeout(() => {
      cardDiv.classList.remove('flip-back');
    }, 1000);
  }

  moveTheCard(sourceId: string, targetId: string) {
    const sourceCircle: any = document.getElementById(sourceId);
    const targetCircle: any = document.getElementById(targetId);
    const sourceRect = sourceCircle.getBoundingClientRect();
    const targetRect = targetCircle.getBoundingClientRect();
    if (sourceRect && targetRect) {
      const deltaX = targetRect.left - sourceRect.left;
      const deltaY = targetRect.top - sourceRect.top;

      setTimeout(function () {
        sourceCircle.style.transition = 'transform 2s ease-in-out';
        sourceCircle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }, 10);
    }
  }
  MoveTheCards(sourceId: string, targetId: string) {
    this.socket.emit('moveTheCard', {
      roomName: this.roomName,
      sourceId: sourceId,
      targetId: targetId,
    });
  }

  async delay() {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
