import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class problemsService {
  constructor(private http: HttpClient) {}
  sendProblem(body: any) {
    return this.http.post(
      `${environment.baseUrl}/api/problems/sendProblem`,
      body
    );
  }
}
