import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { IAppState } from './state/appState';
import { ChangeCurrentPickAction, SelectPlayerAction, UnSelectPlayerAction } from './state/appActions';
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

  constructor(private store: Store<{ app: IAppState }>) {}

  onPlayerClicked(player: IPlayer): void {
    this.store.dispatch(<SelectPlayerAction> { type: 'SELECT_PLAYER', player });
  }

  onUndoPick(pick: IPick) {
    this.store.dispatch(<UnSelectPlayerAction> { type: 'UNSELECT_PLAYER', pick});
  }

  onSelectPick(pick: IPick) {
    this.store.dispatch(<ChangeCurrentPickAction> { type: 'CHANGE_CURRENT_PICK', newPick: pick });
  }
}
