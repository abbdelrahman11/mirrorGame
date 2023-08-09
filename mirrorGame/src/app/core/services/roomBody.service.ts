import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomBodyService {
  constructor(private http: HttpClient) {}
  getAllRooms() {
    return this.http.get(`${environment.baseUrl}/api/rooms/getAllRooms`);
  }
}
