import { Component, OnInit } from '@angular/core';
interface City {
  name: string;
}
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
const socket = io(environment.baseUrl);
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  display: boolean = false;
  selectedPoint: any;
  RoomName: any;
  allRooms: any;
  cities: City[];
  constructor() {
    this.cities = [{ name: '50 Point' }, { name: '100 Point' }];
  }

  ngOnInit(): void {
    socket.on('allRooms', (res) => {
      this.allRooms = res;
    });
    socket.emit('getallRooms');
    socket.on('getallRoomsRes', (res: any) => {
      this.allRooms = res;
    });
  }
  joinTheRoom() {
    console.log('joinTheRoom');
  }

  showDialog() {
    this.display = true;
  }
  CreateRoom() {
    socket.emit('createRoom', {
      roomName: this.RoomName,
      roomPoints: this.selectedPoint,
      usersId: [localStorage.getItem('userId')],
      romMembersCount: '1',
    });
    this.display = false;
  }
}
