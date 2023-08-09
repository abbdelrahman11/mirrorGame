import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface points {
  name: string;
}
import io from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { RoomsService } from 'src/app/core/services/rooms.service';
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
  constructor(
    private service: RoomsService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.points = [{ name: '50 Point' }, { name: '100 Point' }];
  }

  ngOnInit(): void {
    this.getCreatedRoom();
    this.getAllRooms();
    this.socketsOn();
  }
  getCreatedRoom() {
    socket.once('allRooms', (res) => {
      if (res.error) {
        this.toastr.error(res.error);
        return;
      }
      this.display = false;
      this.selectedPoint = '';
      this.RoomName = '';
      this.allRooms = res;
    });
  }
  joinTheRoom(index: number) {
    let data = this.allRooms[index];
    data.usersId.push(localStorage.getItem('userId'));
    localStorage.setItem('roomName', data.roomName);
    socket.emit('joinRoom', data);
  }

  showDialog() {
    this.display = true;
  }
  CreateRoom() {
    localStorage.setItem('roomName', this.RoomName);
    if (this.usersIdArrray.length == 0)
      this.usersIdArrray.push(localStorage.getItem('userId'));
    console.log(this.usersIdArrray);
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
      },
    });
  }
  socketsOn() {
    socket.once('joinedTheRoom', (res) => {
      this.getAllRooms();
    });
    socket.on('canRoute', (res) => {
      this.router.navigateByUrl('roombody');
    });
    socket.on('canJoinRoom', (res) => {
      this.router.navigateByUrl('roombody');
    });
  }

  ngOnDestroy(): void {}
}
