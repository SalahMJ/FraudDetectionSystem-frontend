import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../auth/auth.service';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private auth = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    mergeMap(({ username, password }) => this.auth.login(username, password).pipe(
      // AuthService sets token in localStorage already
      map((res: { access_token: string; token_type: string }) =>
        AuthActions.loginSuccess({ token: res.access_token })
      ),
      catchError(() => of(AuthActions.loginFailure({ error: 'Login failed' })))
    ))
  ));

  logout$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => this.auth.logout())
    ),
    { dispatch: false }
  );

  loginSuccessNavigate$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigate(['/dashboard']))
    ),
    { dispatch: false }
  );
}
