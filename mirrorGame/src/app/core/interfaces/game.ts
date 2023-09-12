import { Card } from './card';

export interface Game {
  _id: string;
  cards: Card[];
  player1: Card[];
  player2: Card[];
  player3: Card[];
  player4: Card[];
  pullCards: Card[];
  tableCards: Card[];
  gameStarted: boolean;
  activeUserIndex: number;
  showTwoCards: boolean;
}
