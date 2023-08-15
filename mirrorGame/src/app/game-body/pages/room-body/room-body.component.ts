import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private service: RoomBodyService) {}
  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
    this.getRoomInfo();
    this.socket.emit('inRoom', {
      roomName: localStorage.getItem('roomName'),
      userId: localStorage.getItem('userId'),
      gameId: localStorage.getItem('gameId'),
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
    this.service
      .getRoomInfo({ roomName: localStorage.getItem('roomName') })
      .subscribe({
        next: (res) => {
          this.roomInfo = res;
        },
      });
  }

  HandOutTheCardsToThePlayers(cards: any) {}

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
