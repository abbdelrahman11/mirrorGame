import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as socketIO from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { RoomsService } from 'src/app/core/services/rooms.service';
import { environment } from 'src/environments/environment';
interface points {
  name: string;
}
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  private socket!: socketIO.Socket;
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
    this.socket = socketIO.io(environment.baseUrl);
    this.getCreatedRoom();
    this.getAllRooms();
    this.socketsOn();
  }
  getCreatedRoom() {
    this.socket.on('allRooms', (res: any) => {
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
    this.socket.emit('joinRoom', data);
  }

  showDialog() {
    this.display = true;
  }
  CreateRoom() {
    localStorage.setItem('roomName', this.RoomName);
    if (this.usersIdArrray.length == 0)
      this.usersIdArrray.push(localStorage.getItem('userId'));
    this.socket.emit('createRoom', {
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
    this.socket.on('joinedTheRoom', (res: any) => {
      this.getAllRooms();
    });
    this.socket.on('canRoute', (res: any) => {
      this.router.navigateByUrl('roombody');
    });
    this.socket.on('canJoinRoom', (res: any) => {
      this.router.navigateByUrl('roombody');
    });
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
