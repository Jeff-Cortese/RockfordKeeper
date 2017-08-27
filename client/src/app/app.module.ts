import { BrowserModule } from '@angular/platform-browser';
import { Inject, InjectionToken, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import 'rxjs/Rx';
import { noop } from 'lodash-es';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ClarityModule } from 'clarity-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { rockfordKeeperReducer } from './state/appReducer';
import { IRockfordKeeper } from './state/appState';
import { AppEffects } from './state/appEffects';
import { AppComponent } from './app.component';
import { PicksComponent } from './picks/picks.component';
import { PlayersComponent } from './players/players.component';
import { PickCardComponent } from './picks/pick-card.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OwnersComponent } from './owners/owners.component';
import { AppContainerComponent } from './app-container.component';
import { RosterCardComponent } from './owners/roster-card.component';

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<IRockfordKeeper>>('Registered Reducers');
Object.assign(REDUCERS_TOKEN, rockfordKeeperReducer);

const pickComponents = [
  PicksComponent,
  PickCardComponent
];

const ownerComponents = [
  OwnersComponent,
  RosterCardComponent
];

@NgModule({
  providers: [
    { provide: REDUCERS_TOKEN, useValue: rockfordKeeperReducer }
  ]
})
export class HackModule {
  constructor(@Inject(REDUCERS_TOKEN) r: any) {
    noop(r);
  }
}

@NgModule({
  declarations: [
    AppContainerComponent,
    AppComponent,
    ...pickComponents,
    PlayersComponent,
    ...ownerComponents
  ],
  imports: [
    RouterModule.forRoot([]),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    ClarityModule.forRoot(),
    CoreModule,
    FormsModule,
    NgxDatatableModule,
    HackModule,
    StoreModule.forRoot(REDUCERS_TOKEN),
    EffectsModule.forRoot([AppEffects]),
    // ...(!environment.production ? [StoreDevtoolsModule.instrument()] : [])
  ],
  providers: [
    //{ provide: REDUCERS_TOKEN, useValue: rockfordKeeperReducer }
  ],
  bootstrap: [AppContainerComponent]
})
export class AppModule { }

