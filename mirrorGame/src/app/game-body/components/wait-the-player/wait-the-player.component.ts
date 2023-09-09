import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wait-the-player',
  templateUrl: './wait-the-player.component.html',
  styleUrls: ['./wait-the-player.component.css'],
})
export class WaitThePlayerComponent implements OnInit {
  @Input() playerCanPlay!: boolean;

  constructor() {}

  ngOnInit(): void {}
}
