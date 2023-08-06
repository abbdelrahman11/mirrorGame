import { Component, OnInit } from '@angular/core';
interface points {
  name: string;
}
import io from 'socket.io-client';
import { RoomsService } from 'src/app/core/services/rooms';
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
  points: points[];
  usersIdArrray: any[] = [];
  constructor(private service: RoomsService) {
    this.points = [{ name: '50 Point' }, { name: '100 Point' }];
  }

  ngOnInit(): void {
    this.getNewRooms();
    this.getAllRooms();
    socket.on('joinedTheRoom', (res) => {
      this.getAllRooms();
    });
  }
  getNewRooms() {
    socket.on('allRooms', (res) => {
      this.display = false;
      this.selectedPoint = '';
      this.RoomName = '';
      this.allRooms = res;
    });
  }
  joinTheRoom(index: number) {
    let data = this.allRooms[index];
    console.log(data, 'fromFront');
    data.usersId.push(localStorage.getItem('userId'));
    socket.emit('joinRoom', data);
  }

  showDialog() {
    this.display = true;
  }
  CreateRoom() {
    // this.usersIdArrray.push(localStorage.getItem('userId'));
    socket.emit('createRoom', {
      roomName: this.RoomName,
      roomPoints: this.selectedPoint,
      usersId: this.usersIdArrray,
    });
  }
  getAllRooms() {
    this.service.getAllRooms().subscribe({
      next: (res) => {
        this.allRooms = res;
        console.log(res);
      },
    });
  }
}
