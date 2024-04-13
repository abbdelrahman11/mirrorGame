import { createFeatureSelector, createSelector } from '@ngrx/store';
import { playerStatusState } from '../models/playerStatus.interface';

export const playerStatus =
  createFeatureSelector<playerStatusState>('playerStatus');
export const TakeOneCardAndGiveOne = createSelector(
  playerStatus,
  (state) => state.TakeOneCardAndGiveOne
);
