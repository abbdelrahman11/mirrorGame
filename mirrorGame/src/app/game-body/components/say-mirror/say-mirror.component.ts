import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/services/socket-service.service';

@Component({
  selector: 'app-say-mirror',
  templateUrl: './say-mirror.component.html',
  styleUrls: ['./say-mirror.component.css'],
})
export class SayMirrorComponent implements OnInit {
  constructor(private socket: SocketService) {}
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  @Input() playersIndex!: number;
  ngOnInit(): void {}
  sayMirror() {
    this.socket.emit('finishTheRound', {
      gameId: this.gameId,
      roomName: this.roomName,
      playersIndex: this.playersIndex,
    });
  }
}
