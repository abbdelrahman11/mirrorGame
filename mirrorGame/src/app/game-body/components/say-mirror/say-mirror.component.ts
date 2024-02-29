import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/services/socket-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-say-mirror',
  templateUrl: './say-mirror.component.html',
  styleUrls: ['./say-mirror.component.css'],
})
export class SayMirrorComponent implements OnInit {
  blocksayMirrorTheButton!: boolean;
  constructor(private socket: SocketService, private toastr: ToastrService) {}
  @Input() gameId!: string | undefined;
  @Input() roomName!: string | undefined;
  @Input() playersIndex!: number;
  @Input() finishTheRound!: number;
  ngOnInit(): void {}
  sayMirror() {
    this.socket.emit('finishTheRound', {
      gameId: this.gameId,
      roomName: this.roomName,
      playersIndex: this.playersIndex,
    });
    this.blocksayMirrorTheButton = true;
    this.toastr.success('You Can Not play', 'You Said Mirror');
  }
}
