import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as socketIO from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { RoomsService } from 'src/app/core/services/rooms.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/core/interfaces/user';
import { Room } from 'src/app/core/interfaces/room';
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
  selectedPoint!: string;
  RoomName!: string;
  allRooms!: Room[];
  points: points[];
  usersIdArrray: Array<string | undefined> = [];
  userId!: string | undefined;
  gameId!: string;
  constructor(
    private service: RoomsService,
    private router: Router,
    private toastr: ToastrService,
    private ActivatedRoute: ActivatedRoute
  ) {
    this.points = [{ name: '50 Point' }, { name: '100 Point' }];
  }

  ngOnInit(): void {
    const userIdParam = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.userId = userIdParam !== null ? userIdParam : undefined;
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
      this.allRooms = res;
    });
  }
  joinTheRoom(room: Room) {
    let data = room;
    data.usersId.push(this.userId);
    this.RoomName = data.roomName;
    this.socket.emit('joinRoom', data);
    this.gameId = data.gameId;
  }

  showDialog() {
    this.display = true;
  }
  CreateRoom() {
    if (this.usersIdArrray.length == 0) this.usersIdArrray.push(this.userId);
    this.socket.emit('createRoom', {
      roomName: this.RoomName,
      roomPoints: this.selectedPoint,
      usersId: this.usersIdArrray,
    });
  }
  getAllRooms() {
    this.service.getAllRooms().subscribe({
      next: (res: any) => {
        this.allRooms = res;
      },
    });
  }
  socketsOn() {
    this.socket.on('joinedTheRoom', (res: any) => {
      this.getAllRooms();
    });
    this.socket.on('canRoute', (res: any) => {
      this.router.navigate(['roombody', this.RoomName, res, this.userId]);
    });
    this.socket.on('canJoinRoom', (res: any) => {
      this.router.navigate([
        'roombody',
        this.RoomName,
        this.gameId,
        this.userId,
      ]);
    });
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
