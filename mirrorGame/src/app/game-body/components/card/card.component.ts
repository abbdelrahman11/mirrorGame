import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() flip!: boolean;
  @Input() CardData!: any;
  @Input() disabled!: boolean;
  @Input() cardWidth!: number;
  @Input() cardHeight!: number;
  constructor() {}
  ngOnInit(): void {}
  ngOnChanges(): void {}
}
