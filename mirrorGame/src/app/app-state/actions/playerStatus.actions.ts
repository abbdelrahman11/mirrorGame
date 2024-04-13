import { createAction, props } from '@ngrx/store';

export const player_status = createAction(
  '[playerStatus] chengeValue',
  props<{ statusName: string; value: boolean }>()
);
