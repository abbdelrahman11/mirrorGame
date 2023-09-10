import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectService } from 'src/app/core/services/redirect.service';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css'],
})
export class RedirectComponent implements OnInit {
  constructor(private service: RedirectService, private router: Router) {}

  ngOnInit(): void {
    this.checkRedirect();
  }
  checkRedirect() {
    this.service.checkRedirect().subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/rooms', res.user.id]);
      },
    });
  }
}
