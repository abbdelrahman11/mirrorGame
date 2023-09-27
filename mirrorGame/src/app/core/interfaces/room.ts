import { User } from './user';

export interface Room {
  _id: string;
  roomName: string;
  roomPoints: string;
  usersId: any;
  gameId: string;
  users_info: Array<User>;
}
