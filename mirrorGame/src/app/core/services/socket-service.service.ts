import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIO from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket!: socketIO.Socket;
  readonly url: string = environment.baseUrl;
  constructor() {
    this.socket = socketIO.io(this.url);
  }

  listen(eventName: string) {
    return new Observable<any>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
