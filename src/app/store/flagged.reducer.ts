import { createReducer, on } from '@ngrx/store';
import * as FlaggedActions from './flagged.actions';
import { TransactionListItem } from '../models/types';

export interface FlaggedState {
  items: TransactionListItem[];
  loading: boolean;
  error?: string | null;
}

export const initialFlaggedState: FlaggedState = {
  items: [],
  loading: false,
  error: null
};

export const flaggedReducer = createReducer(
  initialFlaggedState,
  on(FlaggedActions.loadFlagged, (state) => ({ ...state, loading: true, error: null })),
  on(FlaggedActions.loadFlaggedSuccess, (state, { items }) => ({ ...state, loading: false, items })),
  on(FlaggedActions.loadFlaggedFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(FlaggedActions.reviewSuccess, (state, { id, decision }) => ({
    ...state,
    items: state.items.map(i => i.id === id ? { ...i, status: decision } : i)
  }))
);
