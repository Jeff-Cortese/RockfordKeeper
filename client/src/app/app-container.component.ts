import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { IAppState } from './state/appState';
import { GetCurrentPickAction, GetOwnersAction, GetPicksAction, GetPlayersAction } from './state/appActions';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'app-container',
  template: `<app-root [state]="state$ | async"></app-root>`
})

export class AppContainerComponent implements OnInit {
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
}
