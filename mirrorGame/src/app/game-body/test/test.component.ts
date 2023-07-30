import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
const socket = io(environment.baseUrl);
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    socket.emit('joinRoom', { username: 'cd', room: 'dc' });
    socket.emit('chatMessage', 'scdcdc');
    socket.on('message', (message) => {
      console.log(message);
    });
    socket.on('roomUsers', (message) => {
      console.log(message);
    });
  }
}
