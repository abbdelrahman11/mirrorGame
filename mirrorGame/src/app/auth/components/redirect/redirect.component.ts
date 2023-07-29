import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectService } from 'src/app/core/services/redirect.service';
import { environment } from 'src/environments/environment';

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
      next: (res) => {
        this.router.navigateByUrl('/');
      },
    });
  }
}
