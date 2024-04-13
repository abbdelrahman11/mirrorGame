import { Action, createReducer, on } from '@ngrx/store';
import { playerStatusState } from '../models/playerStatus.interface';
import { player_status } from '../actions/playerStatus.actions';
const initialState: playerStatusState = {
  finishTheRound: false,
  playersIndex: false,
  showOneCardFromAllThePlayers: false,
  cardIsBasra: false,
  TakeOneCardAndGiveOne: false,
  showOneCardOfOtherPlayerCards: false,
  showOneOfYourCard: false,
  playerNumber: false,
  makeCanPullFromPullCardActive: false,
  canPullFromPullCard: false,
  playerName: '',
};

const reducer = createReducer(
  initialState,
  on(player_status, (state, { value, statusName }) => ({
    ...state,
    [statusName]: value,
  }))
);

export function playerStatusreducer(state: any, action: Action) {
  return reducer(state, action);
}
