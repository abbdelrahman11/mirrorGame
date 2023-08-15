import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-cards',
  templateUrl: './table-cards.component.html',
  styleUrls: ['./table-cards.component.css'],
})
export class TableCardsComponent implements OnInit {
  @Input() Cards!: any;

  constructor() {}

  ngOnInit(): void {}
}
