import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { IAppState } from './state/appState';
import {
  GetCurrentPickAction, GetOwnersAction, GetPicksAction, GetPlayersAction,
  SelectPlayerAction, UnSelectPlayerAction
} from './state/appActions';
import { IPlayer } from './core/players/IPlayer';
import { IPick } from './core/picks/IPick';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  state$: Observable<IAppState>;

  constructor(private store: Store<{ app: IAppState }>) {
    this.state$ = this.store
      .select(thing => thing.app)
      .publishReplay(1)
      .refCount();
  }

  ngOnInit(): void {
    this.store.dispatch(<GetOwnersAction> { type: 'GET_OWNERS' });
    this.store.dispatch(<GetPicksAction> { type: 'GET_PICKS' });
    this.store.dispatch(<GetPlayersAction> { type: 'GET_PLAYERS' });
    this.store.dispatch(<GetCurrentPickAction> { type: 'GET_CURRENT_PICK' });
  }

  onPlayerClicked(player: IPlayer): void {
    this.store.dispatch(<SelectPlayerAction> { type: 'SELECT_PLAYER', player });
  }

  onUndoPick(pick: IPick) {
    this.store.dispatch(<UnSelectPlayerAction> { type: 'UNSELECT_PLAYER', pick});
  }
}
