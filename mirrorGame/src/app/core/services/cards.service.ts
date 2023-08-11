import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  constructor(private http: HttpClient) {}
  getCards() {
    return this.http.get(`${environment.baseUrl}/api/cards/getAllCards`);
  }
}
