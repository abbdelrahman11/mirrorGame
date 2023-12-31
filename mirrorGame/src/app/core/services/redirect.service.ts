import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(private http: HttpClient) {}
  checkRedirect() {
    return this.http.get(`${environment.baseUrl}/auth/login/success`,{ withCredentials: true });
  }
}
