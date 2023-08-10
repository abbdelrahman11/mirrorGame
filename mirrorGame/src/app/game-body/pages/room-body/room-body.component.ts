import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { RoomBodyService } from 'src/app/core/services/roomBody.service';
import { environment } from 'src/environments/environment';

const socket = io(environment.baseUrl);

@Component({
  selector: 'app-room-body',
  templateUrl: './room-body.component.html',
  styleUrls: ['./room-body.component.css'],
})
export class RoomBodyComponent implements OnInit {
  roomInfo: any;
  constructor(private service: RoomBodyService, private router: Router) {}

  ngOnInit(): void {
    this.getRoomInfo();
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
}
