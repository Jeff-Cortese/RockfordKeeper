import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPick } from '../core/picks/IPick';
import { IPlayer } from '../core/players/IPlayer';
import { IOwner } from '../core/owners/IOwner';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  styleUrls: ['./picks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PicksComponent implements OnInit {
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

  ngOnInit(): void {
    this.autoScrolled
      .switchMap(() =>
        this.rawScroll
          .skip(1)
          .do(() => {
            this.userScrolled.emit();
            this.scrollOverridden = true;
          })
      )
      .subscribe();
  }

  onUndoClick(pick: IPick): void {
    this.undoPick.emit(pick);
  }

  onCardClick(pick: IPick): void {
    this.selectPick.emit(pick);
  }
}

