import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoomsService } from 'src/app/core/services/rooms.service';
import { Room } from 'src/app/core/interfaces/room';
import { SocketService } from 'src/app/core/services/socket-service.service';
interface points {
  name: number;
}
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
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
    private ActivatedRoute: ActivatedRoute,
    private socket: SocketService
  ) {
    this.points = [{ name: 50 }, { name: 100 }];
  }

  ngOnInit(): void {
    const userIdParam = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.userId = userIdParam !== null ? userIdParam : undefined;
    this.getCreatedRoom();
    this.getAllRooms();
    this.socketsOn();
  }
  getCreatedRoom() {
    this.socket.listen('allRooms').subscribe((res: any) => {
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
    if (room.usersId.includes(this.userId)) {
      this.toastr.error('Room Already have this User');
    } else {
      this.checkIfCanJoinTheRoom(room.roomName, room);
    }
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
    this.socket.listen('canRoute').subscribe((res: any) => {
      this.router.navigate(['roombody', this.RoomName, res, this.userId]);
    });
    this.socket.listen('canJoinRoom').subscribe((res: any) => {
      this.router.navigate([
        'roombody',
        this.RoomName,
        this.gameId,
        this.userId,
      ]);
    });
  }
  checkIfCanJoinTheRoom(roomName: string, room: Room) {
    this.service.getTheRoom({ roomName: roomName }).subscribe({
      next: (res: any) => {
        if (res.usersId.length < 4) {
          room.usersId.push(this.userId);
          this.RoomName = room.roomName;
          this.socket.emit('joinRoom', room);
          this.gameId = room.gameId;
        }
      },
    });
  }
  ngOnDestroy(): void {
    localStorage.removeItem('canStartTheGame');
  }
}
