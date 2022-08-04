import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { IAppState } from './state/appState';
import {
  ChangeCurrentPickAction, SelectPlayerAction,
  UnSelectPlayerAction
} from './state/appActions';
import { IPlayer } from './core/players/IPlayer';
import { IPick } from './core/picks/IPick';
import { SnapshotAction } from 'angularfire2/database';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @Input() state: IAppState;

  picksScrollOverridden = false;
  mobileTab: 'PLAYERS' | 'ROSTER' = 'PLAYERS';

  constructor(private store: Store<{ app: IAppState }>) {}

  onPlayerClicked(player: SnapshotAction<IPlayer>): void {
    if (!this.state.isAdmin || player.payload.val().isTaken) { return; }

    this.store.dispatch(SelectPlayerAction({ player }));
  }

  onUndoPick(pick: SnapshotAction<IPick>) {
    if (!this.state.isAdmin) { return; }

    this.store.dispatch(UnSelectPlayerAction({ pick }));
  }

  onSelectPick(pick: SnapshotAction<IPick>) {
    if (!this.state.isAdmin) { return; }

    this.store.dispatch(ChangeCurrentPickAction({ newPick: pick }));
    this.picksScrollOverridden = false;
  }

  onUserScrolled() {
    this.picksScrollOverridden = true;
  }

  onCurrentPickClick() {
    this.picksScrollOverridden = false;
  }
}
