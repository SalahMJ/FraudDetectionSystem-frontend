import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FlaggedState } from './flagged.reducer';

export const selectFlaggedState = createFeatureSelector<FlaggedState>('flagged');

export const selectFlaggedItems = createSelector(
  selectFlaggedState,
  (state) => state.items
);

export const selectFlaggedLoading = createSelector(
  selectFlaggedState,
  (state) => state.loading
);

export const selectFlaggedError = createSelector(
  selectFlaggedState,
  (state) => state.error
);
