export interface Result {
  _id: string;
  round: {
    _id: string;
    player1: number;
    player2: number;
    player3: number;
    player4: number;
  };
  roomName: string;
  createdAt: string;
  updatedAt: string;
}
