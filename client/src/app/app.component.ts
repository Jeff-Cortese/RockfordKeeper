import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { IAppState } from './state/appState';
import { GetOwnersAction, GetPicksAction, GetPlayersAction } from './state/appActions';

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
  }
}
