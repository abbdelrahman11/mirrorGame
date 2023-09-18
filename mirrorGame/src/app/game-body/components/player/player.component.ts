import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() showPlayerCards!: boolean;
  flipCardsArray: Array<boolean> = [];
  @Output() onShowPlayerCardChange = new EventEmitter<boolean>(false);
  @Output() updateTheCards = new EventEmitter<boolean>(false);

  constructor() {}
  ngOnChanges() {
    console.log(this.showPlayerCards, 'showPlayerCards');
  }
  ngOnInit(): void {}
  CardChecked(index: number) {
    if (this.showPlayerCards) {
      this.showOneOfYourCardFeature(index);
    }
  }
  showOneOfYourCardFeature(index: number) {
    this.flipCardsArray[index] = true;
    setTimeout(() => {
      this.flipCardsArray[index] = false;
      this.updateTheCards.emit(true);
      this.onShowPlayerCardChange.emit(false);
    }, 2000);
  }
}
