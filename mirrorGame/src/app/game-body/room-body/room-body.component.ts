import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

const socket = io(environment.baseUrl);

@Component({
  selector: 'app-room-body',
  templateUrl: './room-body.component.html',
  styleUrls: ['./room-body.component.css'],
})
export class RoomBodyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
