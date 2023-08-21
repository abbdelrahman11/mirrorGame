import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as socketIO from 'socket.io-client';
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
  roomInfo: any = [];
  playerCards: any;
  pullCards: any;
  roomName!: string | undefined;
  userId!: string | undefined;
  gameId!: string | undefined;
  constructor(
    private service: RoomBodyService,
    private ActivatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getRouteParams();
    this.socket = socketIO.io(environment.baseUrl);
    this.getRoomInfo();
    this.socket.emit('inRoom', {
      roomName: this.roomName,
      userId: this.userId,
      gameId: this.gameId,
    });
    this.socket.on('joinedTheRoom', (res) => {
      this.getRoomInfo();
    });
    this.socket.on('playerCards', (res) => {
      this.playerCards = res;

      console.log(res, 'playerCards');
      // this.HandOutTheCardsToThePlayers(res);
    });
    this.socket.on('pullCards', (res) => {
      this.pullCards = res;
      console.log(res, 'pullCards');
    });
  }
  getRoomInfo() {
    this.service.getRoomInfo({ roomName: this.roomName }).subscribe({
      next: (res) => {
        this.roomInfo = res;
      },
    });
  }

  HandOutTheCardsToThePlayers(cards: any) {}
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
