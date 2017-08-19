import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken, NgModule } from '@angular/core';

import 'rxjs/Rx';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ClarityModule } from 'clarity-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { appReducer } from './state/appReducer';
import { IAppState } from './state/appState';
import { AppEffects } from './state/appEffects';
import { AppComponent } from './app.component';
import { PicksComponent } from './picks/picks.component';
import { PlayersComponent } from './players/players.component';
import { PickCardComponent } from './picks/pick-card.component';

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<{ app: IAppState }>>('Registered Reducers');
const reducer = { app: appReducer };
Object.assign(REDUCERS_TOKEN, reducer);

const pickComponents = [
  PicksComponent,
  PickCardComponent
];

@NgModule({
  declarations: [
    AppComponent,
    ...pickComponents,
    PlayersComponent
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    ClarityModule.forRoot(),
    CoreModule,
    StoreModule.forRoot(REDUCERS_TOKEN),
    EffectsModule.forRoot([AppEffects]),
    ...(!environment.production ? [StoreDevtoolsModule.instrument()] : [])
  ],
  providers: [
    { provide: REDUCERS_TOKEN, useValue: reducer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
