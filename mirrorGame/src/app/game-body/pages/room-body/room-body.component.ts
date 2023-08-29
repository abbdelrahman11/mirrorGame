import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as socketIO from 'socket.io-client';
import { Card } from 'src/app/core/interfaces/card';
import { Room } from 'src/app/core/interfaces/room';
import { CardsService } from 'src/app/core/services/cards.service';
import { RoomBodyService } from 'src/app/core/services/roomBody.service';
import { environment } from 'src/environments/environment';

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
  canSelectCard!: boolean;
  selectedPullCard!: Card;
  updatedPullCard!: boolean;
  constructor(
    private service: RoomBodyService,
    private ActivatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
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
      console.log(res, 'game');
      console.log(this.playerCards, 'playerCards');
      console.log(this.pullCards, 'pullCards');
      console.log(this.tableCards, 'tableCard');
    });
  }
  getRoomInfo() {
    this.service.getRoomInfo({ roomName: this.roomName }).subscribe({
      next: (res: any) => {
        this.roomInfo = res[0];
      },
    });
  }
  selectTheCard(value: boolean) {
    this.canSelectCard = value;
  }
  theSelectedCard(card: Card) {
    this.selectedPullCard = card;
  }
  updatePullCards(event: boolean) {
    this.updatedPullCard = event;
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
