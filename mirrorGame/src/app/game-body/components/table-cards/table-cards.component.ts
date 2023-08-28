import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';

@Component({
  selector: 'app-table-cards',
  templateUrl: './table-cards.component.html',
  styleUrls: ['./table-cards.component.css'],
})
export class TableCardsComponent implements OnInit {
  @Input() Cards!: Card[];

  constructor() {}

  ngOnInit(): void {}
}
