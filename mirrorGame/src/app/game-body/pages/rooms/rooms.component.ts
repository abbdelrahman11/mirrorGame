import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoomsService } from 'src/app/core/services/rooms.service';
import { Room } from 'src/app/core/interfaces/room';
import { SocketService } from 'src/app/core/services/socket-service.service';
import { problemsService } from 'src/app/core/services/problems.service';

interface points {
  name: number;
}
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  showTheDialog: boolean = false;
  selectedPoint!: string;
  RoomName!: string;
  allRooms!: Room[];
  points: points[];
  usersIdArrray: Array<string | undefined> = [];
  userId!: string | undefined;
  gameId!: string;
  showTheInstructions!: boolean;
  showTheInput!: boolean;
  ProblemText: any;
  constructor(
    private service: RoomsService,
    private router: Router,
    private toastr: ToastrService,
    private ActivatedRoute: ActivatedRoute,
    private socket: SocketService,
    private problemsService: problemsService
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
      this.showTheDialog = false;
      this.selectedPoint = '';
      this.allRooms = res;
    });
  }
  joinTheRoom(room: Room) {
    this.checkIfCanJoinTheRoom(room.roomName);
  }

  showDialog() {
    this.showTheDialog = true;
  }
  showInstructions() {
    this.showTheInstructions = true;
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
      next: (res: Object) => {
        this.allRooms = res as Room[];
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
  checkIfCanJoinTheRoom(roomName: string) {
    this.service.getTheRoom({ roomName: roomName }).subscribe({
      next: (res: any) => {
        if (res.usersId.includes(this.userId)) {
          this.router.navigate([
            'roombody',
            res.roomName,
            res.gameId,
            this.userId,
          ]);
        } else {
          if (res.usersId.length < 4) {
            res.usersId.push(this.userId);
            this.RoomName = res.roomName;
            this.socket.emit('joinRoom', res);
            this.gameId = res.gameId;
          } else {
            this.toastr.error('Room Completed');
            this.getAllRooms();
          }
        }
      },
    });
  }
  send() {
    this.problemsService
      .sendProblem({
        text: this.ProblemText,
        username: this.userId,
      })
      .subscribe({
        next: (res) => {
          this.showTheInput = false;
          this.ProblemText = '';
          this.toastr.success('The problem was sent');
        },
      });
  }
  ngOnDestroy(): void {
    localStorage.removeItem('canStartTheGame');
  }
}
