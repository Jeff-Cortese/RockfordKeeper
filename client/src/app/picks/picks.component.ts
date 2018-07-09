import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';

import { Subject } from "rxjs";
import { switchMap, skip, tap, takeUntil } from "rxjs/operators";

import { IPick } from '../core/picks/IPick';
import { IPlayer } from '../core/players/IPlayer';
import { IOwner } from '../core/owners/IOwner';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  styleUrls: ['./picks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PicksComponent implements OnInit, OnDestroy {
  @Input() picks: IPick[];
  @Input() players: IPlayer[];
  @Input() owners: IOwner[];
  @Input() currentPick: IPick;
  @Input() scrollOverridden = false;
  @Input() canChangeCurrentPick = false;
  @Input() canUndoPick = false;

  @Output() selectPick = new EventEmitter<IPick>();
  @Output() undoPick = new EventEmitter<IPick>();
  @Output() userScrolled = new EventEmitter();

  autoScrolled = new EventEmitter();
  rawScroll = new EventEmitter();
  ngDestroy$ = new Subject<any>()

  ngOnInit(): void {
    this.autoScrolled.pipe(
      switchMap(() =>
        this.rawScroll.pipe(
          skip(1),
          tap(() => {
            this.userScrolled.emit();
            this.scrollOverridden = true;
          })
        )
      ),
      takeUntil(this.ngDestroy$)
    )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }

  onUndoClick(pick: IPick): void {
    this.undoPick.emit(pick);
  }

  onCardClick(pick: IPick): void {
    this.selectPick.emit(pick);
  }
}

