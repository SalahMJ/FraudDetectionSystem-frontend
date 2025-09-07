import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { tokenInterceptor } from './app/auth/token-interceptor';
import { flaggedReducer } from './app/store/flagged.reducer';
import { FlaggedEffects } from './app/store/flagged.effects';
import { authReducer } from './app/store/auth.reducer';
import { AuthEffects } from './app/store/auth.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideStore({ flagged: flaggedReducer, auth: authReducer }),
    provideEffects([FlaggedEffects, AuthEffects]),
    provideStoreDevtools({ maxAge: 25 })
  ]
}).catch(err => console.error(err));
