import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'src/app/core/interfaces/card';
import { Room } from 'src/app/core/interfaces/room';
import { RoomBodyService } from 'src/app/core/services/roomBody.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SocketService } from 'src/app/core/services/socket-service.service';
import { Game } from 'src/app/core/interfaces/game';

@Component({
  selector: 'app-room-body',
  templateUrl: './room-body.component.html',
  styleUrls: ['./room-body.component.css'],
})
export class RoomBodyComponent implements OnInit {
  roomInfo!: Room;
  playerCards!: Card[];
  pullCards!: Card[];
  tableCards!: Card[];
  roomName!: string | undefined;
  userId!: string | undefined;
  gameId!: string | undefined;
  playersIndex!: number;
  canPullFromPullCard!: boolean;
  selectedPullCard!: Card;
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
  updateTheCard!: boolean;
  constructor(
    private service: RoomBodyService,
    private ActivatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private socket: SocketService
  ) {}
  ngOnInit(): void {
    // this.socket.on('connect', () => {
    //   this.spinner.hide();
    // });

    // this.socket.on('disconnect', () => {
    //   this.spinner.show();
    // });
    this.getRouteParams();
    this.getRoomInfo();
    this.socket.emit('inRoom', {
      roomName: this.roomName,
      userId: this.userId,
      gameId: this.gameId,
    });
    this.socket.listen('joinedTheRoom').subscribe({
      next: (res) => {
        this.getRoomInfo();
      },
    });
    this.socket.listen('playerIndex').subscribe((res: number) => {
      this.playersIndex = res as number;
    });

    this.socket.listen('allCards').subscribe((res: any) => {
      this.playerCards = res[0]['player' + this.playersIndex];
      this.pullCards = res[0].pullCards;
      this.tableCards = res[0].tableCards;
      this.activePlayer = res[0].activeUserIndex;
      this.checkIfPlayerCanPlay();
      this.showLogs();
      this.showTwoCardsToThePlayer(res[0].showTwoCards);
      this.fourPlayerCards(res[0], this.playersIndex);
    });
  }
  fourPlayerCards(game: any, playersIndex: number) {
    this.allPlayersCards = [];
    for (let index = 1; index < 5; index++) {
      this.allPlayersCards.push({
        number: index,
        playerCards: game[`player${index}`],
      });
    }
    let playersCardsCopy = [...this.allPlayersCards];
    playersCardsCopy.splice(playersIndex - 1, 1);
    this.makeDaynamicPlayer(playersCardsCopy, 4);
  }
  makeDaynamicPlayer(
    playersCopy: Array<{ number: number; playerCards: Card[] }>,
    playersCount: number
  ) {
    for (let index = 1; index < playersCount; index++) {
      let playernumber: number =
        (this.playersIndex + index) % playersCount == 0
          ? playersCount
          : (this.playersIndex + index) % playersCount;
      let playerCards: Array<{ number: number; playerCards: Card[] }> =
        playersCopy.filter((val) => {
          return val.number == playernumber;
        });
      this.daynamicPlayer[playernumber] = playerCards[0];
    }
  }

  showLogs() {
    console.log(this.playerCards, 'playerCards');
    console.log(this.pullCards, 'pullCards');
    console.log(this.tableCards, 'tableCard');
  }
  showTwoCardsToThePlayer(showTwoCards: boolean) {
    if (showTwoCards) {
      this.showTwoCards = showTwoCards;
    }
  }
  getRoomInfo() {
    this.service.getRoomInfo({ roomName: this.roomName }).subscribe({
      next: (res: any) => {
        this.roomInfo = res[0];
      },
    });
  }
  canPullFromPullCards(value: boolean) {
    this.canPullFromPullCard = value;
  }
  onCanSelectCardChange(newValue: boolean) {
    this.canPullFromPullCard = newValue;
  }
  onCanPullFromTheGroundChange(newValue: boolean) {
    this.canPullFromTheGround = newValue;
  }
  theSelectedCard(card: Card) {
    this.selectedPullCard = card;
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
    console.log(newvalue, 'newvalue');
    this.showPlayerCards = newvalue;
  }
  showPlayerCard(value: boolean) {
    this.showPlayerCards = value;
  }
  updateTheCards(value: boolean) {
    console.log(value, 'updateTheCard');
    this.updateTheCard = value;
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
