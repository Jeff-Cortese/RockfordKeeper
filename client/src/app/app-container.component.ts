import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { IAppState } from './state/appState';
import {
  GetCurrentPickAction, GetOwnersAction, GetPicksAction, GetPlayersAction,
  MakeAdminAction
} from './state/appActions';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-container',
  template: `<app-root [state]="state$ | async"></app-root>`
})

export class AppContainerComponent implements OnInit {
  state$: Observable<IAppState>;

  constructor(
    private store: Store<{ app: IAppState }>,
    private route: ActivatedRoute
  ) {
    this.state$ = this.store
      .select(thing => thing.app)
      .publishReplay(1)
      .refCount();
  }

  ngOnInit(): void {
    this.route.queryParams
      .do((params: Params) => {
        if (params.admin === 'true') {
          this.store.dispatch(<MakeAdminAction> { type: 'MAKE_USER_ADMIN' });
        }
      })
      .subscribe();

    this.store.dispatch(<GetOwnersAction> { type: 'GET_OWNERS' });
    this.store.dispatch(<GetPicksAction> { type: 'GET_PICKS' });
    this.store.dispatch(<GetPlayersAction> { type: 'GET_PLAYERS' });
    this.store.dispatch(<GetCurrentPickAction> { type: 'GET_CURRENT_PICK' });
  }
}
