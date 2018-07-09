import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { tap, publishReplay, refCount, takeUntil } from "rxjs/operators";

import { IAppState } from './state/appState';
import {
  GetCurrentPickAction, GetOwnersAction, GetPicksAction, GetPlayersAction,
  MakeAdminAction
} from './state/appActions';

@Component({
  moduleId: module.id,
  selector: 'app-container',
  template: `<app-root [state]="state$ | async"></app-root>`
})

export class AppContainerComponent implements OnInit, OnDestroy {
  state$: Observable<IAppState>;
  ngDestroy$ = new Subject<any>();

  constructor(
    private store: Store<{ app: IAppState }>,
    private route: ActivatedRoute
  ) {
    this.state$ = this.store.pipe(
      select(thing => thing.app),
      publishReplay(1),
      refCount()
    );
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap((params: Params) => {
        if (params.admin === 'true') {
          this.store.dispatch(<MakeAdminAction> { type: 'MAKE_USER_ADMIN' });
        }
      }),
      takeUntil(this.ngDestroy$)
    ).subscribe();

    this.store.dispatch(<GetOwnersAction> { type: 'GET_OWNERS' });
    this.store.dispatch(<GetPicksAction> { type: 'GET_PICKS' });
    this.store.dispatch(<GetPlayersAction> { type: 'GET_PLAYERS' });
    this.store.dispatch(<GetCurrentPickAction> { type: 'GET_CURRENT_PICK' });
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }
}
