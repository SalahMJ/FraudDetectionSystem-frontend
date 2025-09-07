import { createAction, props } from '@ngrx/store';
import { TransactionListItem } from '../models/types';

export const loadFlagged = createAction('[Flagged] Load', props<{ limit?: number }>());
export const loadFlaggedSuccess = createAction('[Flagged] Load Success', props<{ items: TransactionListItem[] }>());
export const loadFlaggedFailure = createAction('[Flagged] Load Failure', props<{ error: string }>());

export const reviewTransaction = createAction(
  '[Flagged] Review',
  props<{ id: string; decision: 'APPROVED' | 'REJECTED'; notes?: string }>()
);
export const reviewSuccess = createAction(
  '[Flagged] Review Success',
  props<{ id: string; decision: 'APPROVED' | 'REJECTED' }>()
);
export const reviewFailure = createAction('[Flagged] Review Failure', props<{ error: string }>());
