import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { CardsService } from 'src/app/core/services/cards.service';
import { RoomBodyService } from 'src/app/core/services/roomBody.service';
import { environment } from 'src/environments/environment';

const socket = io(environment.baseUrl);

@Component({
  selector: 'app-room-body',
  templateUrl: './room-body.component.html',
  styleUrls: ['./room-body.component.css'],
})
export class RoomBodyComponent implements OnInit {
  roomInfo: any = [];
  allCards: any;
  constructor(
    private service: RoomBodyService,
    private cService: CardsService,
    private router: Router
  ) {}
  ngOnChanges(): void {
    console.log(socket.id);
  }
  ngOnInit(): void {
    this.getRoomInfo();
    socket.emit('inRoom', {
      roomName: localStorage.getItem('roomName'),
      userId: localStorage.getItem('userId'),
    });
    socket.on('joinedTheRoom', (res) => {
      this.getRoomInfo();
    });
    socket.on('AllCards', (res) => {
      console.log(res);
    });
  }
  getRoomInfo() {
    this.service
      .getRoomInfo({ roomName: localStorage.getItem('roomName') })
      .subscribe({
        next: (res) => {
          this.roomInfo = res;
          console.log(this.roomInfo);
        },
      });
  }
  ngOnDestroy(): void {
    socket.disconnect();
  }
}
