import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/services/socket-service.service';

@Component({
  selector: 'app-game-finished',
  templateUrl: './game-finished.component.html',
  styleUrls: ['./game-finished.component.css'],
})
export class GameFinishedComponent implements OnInit {
  showTheResult: any;
  constructor() {}

  ngOnInit(): void {}
}
