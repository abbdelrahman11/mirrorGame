import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/services/socket-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-say-mirror',
  templateUrl: './say-mirror.component.html',
  styleUrls: ['./say-mirror.component.css'],
})
export class SayMirrorComponent implements OnInit {
  blockTheButton!: boolean;
  constructor(private socket: SocketService, private toastr: ToastrService) {}
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
    this.blockTheButton = true;
    this.toastr.success('This Is Your Last Move', 'You Said Mirror');
  }
}
