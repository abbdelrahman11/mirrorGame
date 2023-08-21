import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  userId!: any;
  gameId!: number;
  constructor(
    private service: RoomsService,
    private router: Router,
    private toastr: ToastrService,
    private ActivatedRoute: ActivatedRoute
  ) {
    this.points = [{ name: '50 Point' }, { name: '100 Point' }];
  }

  ngOnInit(): void {
    this.userId = this.ActivatedRoute.snapshot.paramMap.get('id');
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
  joinTheRoom(index: number) {
    let data = this.allRooms[index];
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
      console.log(this.userId);
      this.router.navigate(['roombody', this.RoomName, res, this.userId]);
    });
    this.socket.on('canJoinRoom', (res: any) => {
      console.log(this.userId);
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
