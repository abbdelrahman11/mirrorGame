import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';
import { User } from 'src/app/core/interfaces/user';

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
  @Input() takeAndGive!: boolean;
  @Input() showFourPlayerCards!: boolean;
  @Input() counterUpdatedForPlayers!: number;
  @Input() playersInfo!: User[];
  @Input() column!: boolean;
  @Output() onShowPlayerCardChange = new EventEmitter<boolean>(false);
  @Output() updateCounterForPlayers = new EventEmitter<number>();
  @Output() onshowFourPlayerCardsChange = new EventEmitter<boolean>(false);
  @Output() updateTheCards = new EventEmitter<boolean>(false);
  @Output() takeAndGiveSelectedCard = new EventEmitter<{
    allCard: Card[];
    card: Card;
    playerNumber: number;
    cardIndex: number;
  }>();
  flipCardsArray: Array<boolean> = [];
  counter!: number;
  clickedCards: number[] = [];
  isSmallScreen = false;

  @HostBinding('class.your-class')
  get shouldApplyClass() {
    return this.isSmallScreen;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.checkScreenSize();
  }

  constructor() {
    this.checkScreenSize();
  }
  private checkScreenSize() {
    if (this.column) {
      this.isSmallScreen = window.innerWidth > 350 && window.innerWidth < 576; // Adjust the breakpoint as per your needs
    }
  }
  ngOnChanges() {
    console.log(this.column);
    if (this.column) {
      this.checkScreenSize();
    }
  }
  ngOnInit(): void {}
  CardChecked(index: number) {
    if (this.showPlayerCards) {
      this.showOneOfYourCardFeature(index);
    }
    if (this.showFourPlayerCards) {
      this.showFourPlayerCardsFeature(index, this.playerNumber);
    }
    if (this.takeAndGive) {
      this.takeAndGiveCard(index, this.playerNumber);
    }
  }
  showOneOfYourCardFeature(index: number) {
    this.flipCardsArray[index] = true;
    this.onShowPlayerCardChange.emit(false);
    setTimeout(() => {
      this.flipCardsArray[index] = false;
      this.updateTheCards.emit(true);
    }, 2000);
  }

  showFourPlayerCardsFeature(index: number, playerNumber: number) {
    this.counter = this.counterUpdatedForPlayers;
    if (!this.clickedCards.includes(playerNumber)) {
      this.counter++;
      this.updateCounterForPlayers.emit(this.counter | 0);
      if (this.counter != 2) {
        this.clickedCards.push(playerNumber);
        this.flipCardsArray[index] = true;
        setTimeout(() => {
          this.flipCardsArray[index] = false;
        }, 2000);
      } else {
        this.flipCardsArray[index] = true;
        this.onshowFourPlayerCardsChange.emit(false);
        setTimeout(() => {
          this.flipCardsArray[index] = false;
          this.updateTheCards.emit(true);
        }, 2000);
      }
    }
  }

  takeAndGiveCard(index: number, playerNumber: number) {
    this.takeAndGiveSelectedCard.emit({
      allCard: this.playerCard,
      card: this.playerCard[index],
      playerNumber,
      cardIndex: index,
    });
  }
}
