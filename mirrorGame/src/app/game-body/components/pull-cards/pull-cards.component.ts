import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Card } from 'src/app/core/interfaces/card';
import * as socketIO from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pull-cards',
  templateUrl: './pull-cards.component.html',
  styleUrls: ['./pull-cards.component.css'],
})
export class PullCardsComponent implements OnInit {
  private socket!: socketIO.Socket;
  @Input() Cards!: Card[] | [];
  splicedCards!: Card[];
  @Input() gameId!: string | undefined;
  @Input() updatePullCards!: boolean;
  @Input() roomName!: string | undefined;
  @Output() selectCard = new EventEmitter<boolean>(false);
  @Output() selectedCard = new EventEmitter<Card>();
  cardToShowToThePlayer!: Card;
  showTheCard: boolean = false;
  cardIndex!: number;

  constructor() {}

  ngOnInit(): void {
    this.socket = socketIO.io(environment.baseUrl);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.Cards) {
      this.splicedCards = [...this.Cards];
    }
    console.log(changes['updatePullCards']);
    if (changes['updatePullCards']?.currentValue === true) {
      console.log('dlvn');
      // this.toGround();
    }
  }

  showToThePlayer(card: Card, index: number) {
    this.showTheCard = true;
    this.cardToShowToThePlayer = card;
    this.cardIndex = index;
  }
  takeTheCard() {
    this.selectCard.emit(true);
    const card = this.splicedCards.splice(this.cardIndex, 1)[0];
    this.selectedCard.emit(card);
  }
  toGround() {
    console.log('dc dvcsf');
    const card = this.splicedCards.splice(this.cardIndex, 1)[0];
    this.showTheCard = false;
    this.socket.emit('addAndDeleteCards', {
      gameId: this.gameId,
      deleteCards: this.splicedCards,
      addCards: card,
      roomName: this.roomName,
      deleteKeyName: 'pullCards',
      addKeyName: 'tableCards',
    });
  }
}
