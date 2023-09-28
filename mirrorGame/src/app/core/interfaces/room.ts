import { User } from './user';

export interface Room {
  _id: string;
  roomName: string;
  roomPoints: number;
  usersId: any;
  gameId: string;
  users_info: Array<User>;
}
