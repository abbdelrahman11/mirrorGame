import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pull-cards',
  templateUrl: './pull-cards.component.html',
  styleUrls: ['./pull-cards.component.css'],
})
export class PullCardsComponent implements OnInit {
  @Input() Cards!: any;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    console.log(this.Cards);
  }
}
