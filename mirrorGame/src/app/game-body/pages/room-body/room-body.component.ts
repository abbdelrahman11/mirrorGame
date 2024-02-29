import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Card } from 'src/app/core/interfaces/card';
import { Room } from 'src/app/core/interfaces/room';
import { RoomBodyService } from 'src/app/core/services/roomBody.service';
import { SocketService } from 'src/app/core/services/socket-service.service';
import { Result } from 'src/app/core/interfaces/result';

@Component({
  selector: 'app-room-body',
  templateUrl: './room-body.component.html',
  styleUrls: ['./room-body.component.css'],
})
export class RoomBodyComponent implements OnInit, AfterContentChecked {
  roomInfo!: Room;
  playerCards!: Card[];
  pullCards!: Card[];
  tableCards!: Card[];
  roomName!: string | undefined;
  userId!: string | undefined;
  gameId!: string | undefined;
  playersIndex!: number;
  canPullFromPullCard!: boolean;
  hideTheCard!: boolean;
  hideButtons!: boolean;
  playerCanPlay!: boolean;
  activePlayer!: number;
  canPullFromTheGround!: boolean;
  selectedTableCard!: Card;
  tableCardsAfterSpliced!: Card[];
  hideTheButton!: boolean;
  showTwoCards!: boolean;
  allPlayersCards: Array<{ number: number; playerCards: Card[] }> = [];
  daynamicPlayer: Array<{ number: number; playerCards: Card[] }> = [];
  showPlayerCards!: boolean;
  showFourPlayerCards!: boolean;
  updateTheCard!: boolean;
  flipAllCardsForPlayers!: boolean;
  updateCounterForPlayers!: number;
  takeAndGive!: boolean;
  takeAndGiveSelectedCard!: {
    card: Card;
    playerNumber: number;
    allCard: Card[];
    cardIndex: number;
  };
  finishTheRound!: number;
  showTheResult!: Result[];
  StartTheGame = localStorage.getItem('canStartTheGame');
  canStartTheGame!: boolean;
  playersInfo!: any;
  roomPoints!: number;
  showGameFinished!: boolean;
  isSmallScreen: boolean = false;
  takeTheCardWithoutCheck!: boolean;
  changeTakeTheCardWithoutCheck!: boolean;

  constructor(
    private service: RoomBodyService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private socket: SocketService,
    private changeDetector: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    if (this.StartTheGame === 'false') {
      this.canStartTheGame = false;
      this.showGameFinished = true;
    } else {
      this.canStartTheGame = true;
    }
    this.getRouteParams();
    if (this.canStartTheGame) {
      this.getRoomInfo();
      this.socket.emit('inRoom', {
        roomName: this.roomName,
        userId: this.userId,
        gameId: this.gameId,
      });
    }
    this.socket.listen('updateTheRoom').subscribe({
      next: (res) => {
        this.getRoomInfo();
      },
    });
    this.socket.listen('playerIndex').subscribe((res: number) => {
      this.playersIndex = res as number;
    });
    this.socket.listen('canStartTheGame').subscribe((res) => {
      this.canStartTheGame = res;
      localStorage.setItem('canStartTheGame', res);
      this.showGameFinished = !res;
    });

    this.socket.listen('allCards').subscribe((res: any) => {
      this.playerCards = res[0]['player' + this.playersIndex];
      this.pullCards = res[0].pullCards;
      this.tableCards = res[0].tableCards;
      this.activePlayer = res[0].activeUserIndex;
      this.finishTheRound = res[0].finishTheRound;
      this.checkIfPlayerCanPlay();
      this.showLogs();
      this.showTwoCardsToThePlayer(res[0].showTwoCards);
      this.fourPlayerCards(res[0], this.playersIndex);
    });
    this.socket.listen('showtheResult').subscribe((res: any) => {
      this.showTheResult = res;
    });
    this.socket.listen('newRound').subscribe({
      next: (res) => {
        this.gameId = res;
        this.router.navigate([
          'roombody',
          this.roomName,
          this.gameId,
          this.userId,
        ]);
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
    });
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  fourPlayerCards(game: any, playersIndex: number) {
    this.allPlayersCards = [];
    for (let index = 1; index < 5; index++) {
      this.allPlayersCards.push({
        number: index,
        playerCards: game[`player${index}`],
      });
    }
    this.allPlayersCards.splice(playersIndex - 1, 1);
    this.makeDaynamicPlayer(this.allPlayersCards, 4);
  }
  makeDaynamicPlayer(
    players: Array<{ number: number; playerCards: Card[] }>,
    playersCount: number
  ) {
    for (let index = 1; index < playersCount; index++) {
      let playernumber: number =
        (this.playersIndex + index) % playersCount == 0
          ? playersCount
          : (this.playersIndex + index) % playersCount;

      let playerCards: Array<{ number: number; playerCards: Card[] }> =
        players.filter((val) => {
          return val.number == playernumber;
        });
      this.daynamicPlayer[playernumber] = playerCards[0];
    }
  }

  showLogs() {
    // console.log(this.playerCards, 'playerCards');
    // console.log(this.pullCards, 'pullCards');
    // console.log(this.tableCards, 'tableCard');
  }
  showTwoCardsToThePlayer(showTwoCards: boolean) {
    this.showTwoCards = showTwoCards;
  }
  getRoomInfo() {
    this.service.getRoomInfo({ roomName: this.roomName }).subscribe({
      next: (res: any) => {
        this.roomInfo = res[0];
        this.playersInfo = res[0]?.users_info;
        this.roomPoints = res[0]?.roomPoints;
      },
    });
  }
  canPullFromPullCards(value: boolean) {
    this.canPullFromPullCard = value;
  }
  takeTheCardWithoutCheckFunction(value: boolean) {
    this.takeTheCardWithoutCheck = value;
  }
  onCanSelectCardChange(newValue: boolean) {
    this.canPullFromPullCard = newValue;
  }
  onchangeTakeTheCardWithoutCheck(newValue: boolean) {
    this.takeTheCardWithoutCheck = newValue;
  }
  onCanPullFromTheGroundChange(newValue: boolean) {
    this.canPullFromTheGround = newValue;
  }

  hideTheCardAndButton(value: boolean) {
    this.hideTheCard = value;
  }
  hideButton(value: boolean) {
    this.hideTheButton = value;
  }

  canPullFromGround(event: boolean) {
    this.canPullFromTheGround = event;
  }
  onShowPlayerCardChange(newvalue: boolean) {
    this.showPlayerCards = newvalue;
  }
  showPlayerCard(value: boolean) {
    this.showPlayerCards = value;
  }
  takeAndGiveCard(value: boolean) {
    this.takeAndGive = value;
  }
  onshowFourPlayerCardChange(newvalue: boolean) {
    this.showFourPlayerCards = newvalue;
  }
  showFourPlayerCard(value: boolean) {
    this.showFourPlayerCards = value;
  }
  updateTheCards(value: boolean) {
    this.updateTheCard = value;
  }
  changeupdateTheCard(newvalue: boolean) {
    this.updateTheCard = newvalue;
  }
  updateCounter(value: number) {
    this.updateCounterForPlayers = value;
  }
  flipAllTheCardsForPlayers() {
    this.flipAllCardsForPlayers = true;
  }
  takeAndGiveSelectedCards(value: {
    card: Card;
    playerNumber: number;
    allCard: Card[];
    cardIndex: number;
  }) {
    this.takeAndGiveSelectedCard = value;
  }
  checkIfPlayerCanPlay() {
    if (this.activePlayer % 4 == 0) {
      this.activePlayer = 4;
      this.playerCanPlay = this.playersIndex == this.activePlayer;
    } else {
      this.playerCanPlay = this.playersIndex == this.activePlayer % 4;
    }
  }
  getRouteParams(): void {
    const roomNameParam = this.ActivatedRoute.snapshot.paramMap.get('roomName');
    this.roomName = roomNameParam !== null ? roomNameParam : undefined;
    const userIdParam = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.userId = userIdParam !== null ? userIdParam : undefined;
    const gameIdParam = this.ActivatedRoute.snapshot.paramMap.get('gameId');
    this.gameId = gameIdParam !== null ? gameIdParam : undefined;
  }
}
