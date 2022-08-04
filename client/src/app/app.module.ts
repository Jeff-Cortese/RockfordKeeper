import { BrowserModule } from '@angular/platform-browser';
import { Component, Inject, InjectionToken, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { noop } from 'lodash-es';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';

import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { rockfordKeeperReducer } from './state/appReducer';
import { IRockfordKeeper } from './state/appState';
import { AppEffects } from './state/appEffects';
import { AppComponent } from './app.component';
import { PicksComponent } from './picks/picks.component';
import { PlayersComponent } from './players/players.component';
import { PickCardComponent } from './picks/pick-card.component';
import { OwnersComponent } from './owners/owners.component';
import { AppContainerComponent } from './app-container.component';
import { RosterCardComponent } from './owners/roster-card.component';
import { LibsModule } from './libs/libs.module';
import { BigBoardComponent } from './big-board/big-board.component';
import { BigBoardCardComponent } from './big-board/big-board-card.component';

/*export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<IRockfordKeeper>>('Registered Reducers');
Object.assign(REDUCERS_TOKEN, { app: rockfordKeeperReducer });*/

const bigBoardComponents = [
  BigBoardComponent,
  BigBoardCardComponent
];

const pickComponents = [
  PicksComponent,
  PickCardComponent
];

const ownerComponents = [
  OwnersComponent,
  RosterCardComponent
];

const routes: Routes = [
  { path: 'draft-board', component: BigBoardComponent },
  { path: '**', component: AppContainerComponent }
];

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class RootComponent {}

/*@NgModule({
  providers: [
    { provide: REDUCERS_TOKEN, useValue: rockfordKeeperReducer }
  ]
})
export class HackModule {
  constructor(@Inject(REDUCERS_TOKEN) r: any) {
    noop(r);
  }
}*/

@NgModule({
  declarations: [
    AppContainerComponent,
    AppComponent,
    ...bigBoardComponents,
    ...pickComponents,
    PlayersComponent,
    ...ownerComponents,
    RootComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    AgGridModule.withComponents([]),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    ClarityModule,
    CoreModule,
    FormsModule,
    LibsModule,
    /*HackModule,*/
    StoreModule.forRoot(/*REDUCERS_TOKEN*/{ app: rockfordKeeperReducer }, { runtimeChecks: { strictActionImmutability: false, strictStateImmutability: false, strictActionWithinNgZone: false }}),
    EffectsModule.forRoot([AppEffects]),
    // ...(!environment.production ? [StoreDevtoolsModule.instrument()] : [])
  ],
  providers: [
    // { provide: REDUCERS_TOKEN, useValue: rockfordKeeperReducer }
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }

