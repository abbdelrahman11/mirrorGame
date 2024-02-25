import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() flip!: boolean;
  @Input() color!: string;
  @Input() CardData!: Card;
  @Input() disabled!: boolean;
  @Input() cardWidth!: number;
  @Input() cardHeight!: number;
  @Input() tableCards!: boolean;
  constructor() {}
  ngOnInit(): void {}
  ngOnChanges(): void {}
}
