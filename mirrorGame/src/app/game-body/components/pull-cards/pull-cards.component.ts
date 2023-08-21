import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pull-cards',
  templateUrl: './pull-cards.component.html',
  styleUrls: ['./pull-cards.component.css'],
})
export class PullCardsComponent implements OnInit {
  @Input() Cards!: any;
  cardToShowToThePlayer: any;
  showTheCard: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(): void {}
  showToThePlayer(card: any) {
    console.log(card);
    this.showTheCard = true;

    this.cardToShowToThePlayer = card;
  }
}
