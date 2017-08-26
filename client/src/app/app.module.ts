import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import 'rxjs/Rx';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ClarityModule } from 'clarity-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { reducerMap } from './state/appReducer';
import { IAppState } from './state/appState';
import { AppEffects } from './state/appEffects';
import { AppComponent } from './app.component';
import { PicksComponent } from './picks/picks.component';
import { PlayersComponent } from './players/players.component';
import { PickCardComponent } from './picks/pick-card.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OwnersComponent } from './owners/owners.component';
import { AppContainerComponent } from './app-container.component';
import { RouterModule } from '@angular/router';

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<{ app: IAppState }>>('Registered Reducers');
Object.assign(REDUCERS_TOKEN, reducerMap);

const pickComponents = [
  PicksComponent,
  PickCardComponent
];

@NgModule({
  declarations: [
    AppContainerComponent,
    AppComponent,
    ...pickComponents,
    PlayersComponent,
    OwnersComponent
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
    StoreModule.forRoot(REDUCERS_TOKEN),
    EffectsModule.forRoot([AppEffects]),
    ...(!environment.production ? [StoreDevtoolsModule.instrument()] : [])
  ],
  providers: [
    { provide: REDUCERS_TOKEN, useValue: reducerMap }
  ],
  bootstrap: [AppContainerComponent]
})
export class AppModule { }
