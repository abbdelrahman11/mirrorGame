import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  @Input() playerCard!: Card[];
  @Input() playerNumber!: number;
  @Input() activePlayerNumber!: number;

  constructor() {}
  ngOnChanges() {}
  ngOnInit(): void {}
}
