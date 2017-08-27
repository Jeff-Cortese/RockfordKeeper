import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { IAppState } from './state/appState';
import {
  ChangeCurrentPickAction, SelectPlayerAction,
  UnSelectPlayerAction
} from './state/appActions';
import { IPlayer } from './core/players/IPlayer';
import { IPick } from './core/picks/IPick';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @Input() state: IAppState;

  picksScrollOverridden = false;
  mobileTab: 'PLAYERS' | 'ROSTER' = 'PLAYERS';

  constructor(private store: Store<{ app: IAppState }>) {}

  onPlayerClicked(player: IPlayer): void {
    if (!this.state.isAdmin || player.isTaken) { return; }

    this.store.dispatch(<SelectPlayerAction> { type: 'SELECT_PLAYER', player });
  }

  onUndoPick(pick: IPick) {
    if (!this.state.isAdmin) { return; }

    this.store.dispatch(<UnSelectPlayerAction> { type: 'UNSELECT_PLAYER', pick});
  }

  onSelectPick(pick: IPick) {
    if (!this.state.isAdmin) { return; }

    this.store.dispatch(<ChangeCurrentPickAction> { type: 'CHANGE_CURRENT_PICK', newPick: pick });
    this.picksScrollOverridden = false;
  }

  onUserScrolled() {
    this.picksScrollOverridden = true;
  }

  onCurrentPickClick() {
    this.picksScrollOverridden = false;
  }
}
