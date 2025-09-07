import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as FlaggedActions from './flagged.actions';
import { FraudService } from '../services/fraud.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { TransactionListItem } from '../models/types';

@Injectable()
export class FlaggedEffects {
  private actions$ = inject(Actions);
  private svc = inject(FraudService);

  load$ = createEffect(() => this.actions$.pipe(
    ofType(FlaggedActions.loadFlagged),
    mergeMap(({ limit }: { limit?: number }) => this.svc.getFlagged(limit ?? 50).pipe(
      map((items: TransactionListItem[]) => FlaggedActions.loadFlaggedSuccess({ items })),
      catchError((err: unknown) => of(FlaggedActions.loadFlaggedFailure({ error: 'Failed to load flagged' })))
    ))
  ));

  review$ = createEffect(() => this.actions$.pipe(
    ofType(FlaggedActions.reviewTransaction),
    mergeMap(({ id, decision, notes }: { id: string; decision: 'APPROVED' | 'REJECTED'; notes?: string }) =>
      this.svc.review(id, decision, notes ?? '').pipe(
        map(() => FlaggedActions.reviewSuccess({ id, decision })),
        catchError((err: unknown) => of(FlaggedActions.reviewFailure({ error: 'Failed to review' })))
      )
    )
  ));

  loadAfterReview$ = createEffect(() => this.actions$.pipe(
    ofType(FlaggedActions.reviewSuccess),
    map(() => FlaggedActions.loadFlagged({ limit: 50 }))
  ));
}
