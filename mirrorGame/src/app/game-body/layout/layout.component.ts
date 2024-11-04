import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(private ActivatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const userIdParam = this.ActivatedRoute.snapshot.paramMap.get('id') || '';
    this.checkIfTherIsUserID(userIdParam);
  }
  ngOnDestroy(): void {
    localStorage.clear();
  }
  checkIfTherIsUserID(userId: string) {
    if (!userId) {
      this.router.navigateByUrl('/auth/login');
    }
  }
}
