import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as socketIO from 'socket.io-client';
import { Card } from 'src/app/core/interfaces/card';
import { Room } from 'src/app/core/interfaces/room';
import { RoomBodyService } from 'src/app/core/services/roomBody.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-room-body',
  templateUrl: './room-body.component.html',
  styleUrls: ['./room-body.component.css'],
})
export class RoomBodyComponent implements OnInit {
  private socket!: socketIO.Socket;
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
  PullCardsAfterSpliced!: Card[];
  hideTheCard!: boolean;
  playerCanPlay!: boolean;
  activePlayer!: number;
  canPullFromTheGround!: boolean;
  selectedTableCard!: Card;
  tableCardsAfterSpliced!: Card[];
  hideTheButton!: boolean;
  showTwoCards!: boolean;
  constructor(
    private service: RoomBodyService,
    private ActivatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
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
    this.socket.on('joinedTheRoom', (res) => {
      this.getRoomInfo();
    });
    this.socket.on('playerIndex', (res) => {
      this.playersIndex = res;
    });

    this.socket.on('allCards', (res) => {
      this.playerCards = res[0][`player${this.playersIndex}`];
      this.pullCards = res[0].pullCards;
      this.tableCards = res[0].tableCards;
      this.activePlayer = res[0].activeUserIndex;
      this.checkIfPlayerCanPlay();
      this.showLogs();
      this.showTwoCardsToThePlayer(res[0].showTwoCards);
    });
  }
  showLogs() {
    console.log(this.playerCards, 'playerCards');
    console.log(this.pullCards, 'pullCards');
    console.log(this.tableCards, 'tableCard');
  }
  showTwoCardsToThePlayer(showTwoCards: boolean) {
    console.log(showTwoCards);
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
  allPullCards(cards: Card[]) {
    this.PullCardsAfterSpliced = cards;
  }
  theSelectedTableCard(card: Card) {
    this.selectedTableCard = card;
  }
  allTableCards(cards: Card[]) {
    this.tableCardsAfterSpliced = cards;
  }
  hideTheCards(value: boolean) {
    this.hideTheCard = value;
  }
  hideButton(value: boolean) {
    this.hideTheButton = value;
  }

  canPullFromGround(event: boolean) {
    this.canPullFromTheGround = event;
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
  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
