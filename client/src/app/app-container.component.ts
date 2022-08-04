import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { tap, publishReplay, refCount, takeUntil } from 'rxjs/operators';

import { IAppState, initialState } from './state/appState';
import {
  GetCurrentPickAction, GetOwnersAction, GetPicksAction, GetPlayersAction,
  MakeAdminAction
} from './state/appActions';

@Component({
  moduleId: module.id,
  selector: 'app-container',
  template: `
    <app [state]="state$ | async"></app>
  `
})
export class AppContainerComponent implements OnInit, OnDestroy {
  showBigBoard = false;
  state$: Observable<IAppState>;
  ngDestroy$ = new Subject<any>();

  constructor(
    private store: Store<{ app: IAppState }>,
    private route: ActivatedRoute
  ) {
    this.state$ = this.store.pipe(
      select(thing => thing?.app ?? initialState),
      publishReplay(1),
      refCount()
    );
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap((params: Params) => {
        if (params.admin === 'true') {
          this.store.dispatch(MakeAdminAction());
        }
      }),
      takeUntil(this.ngDestroy$)
    ).subscribe();

    this.store.dispatch(GetOwnersAction());
    this.store.dispatch(GetPicksAction());
    this.store.dispatch(GetPlayersAction());
    this.store.dispatch(GetCurrentPickAction());
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }
}
