import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { identity, includes, isEmpty, some } from 'lodash-es';
import { IPlayer, PlayerPosition } from '../core/players/IPlayer';
import { SnapshotAction } from 'angularfire2/database';
import { AgGridNg2 } from 'ag-grid-angular';

const defaultFilter: { [TKey in PlayerPosition]: boolean } = Object.freeze({
  'QB': false,
  'RB': false,
  'WR': false,
  'TE': false,
  'D/ST': false,
  'K': false
});

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersComponent {
  @Input() players: SnapshotAction<IPlayer>[];
  @Input() canMakePick = false;

  @Output() playerClicked = new EventEmitter<SnapshotAction<IPlayer>>();

  @ViewChild('grid') grid: AgGridNg2;
  showUnavailable = false;
  playerSearchQuery: string;
  positionFilter = defaultFilter;
  anyPositionFilters = false;
  isMobile = /iPhone|iPod|Android/i.test(navigator.userAgent);

  getPlayerId = (player: SnapshotAction<IPlayer>) => player.payload.val().espnPlayerId;

  getRowClass = ({ data: playerSnapshot }) =>  playerSnapshot.payload.val().isTaken ? 'player-taken' : '';

  getPayloadValue = (prop) => ({ data }) => data.payload.val()[prop];

  shouldShowPlayer = p => !this.shouldHidePlayer(p);

  anyFiltersOn = () => some(this.positionFilter, key => key === true) || !this.showUnavailable;

  shouldHidePlayer({ data: playerSnapshot }): boolean {
    const player = playerSnapshot.payload.val();
    const hideIfTaken = !this.showUnavailable && player.isTaken;
    const hideIfNotInFilter = this.anyPositionFilters && !this.positionFilter[player.position];
    const hideIfNotSearchedFor = !isEmpty(this.playerSearchQuery) && !includes(player.lowerName, this.playerSearchQuery.toLowerCase());
    return hideIfTaken || hideIfNotInFilter || hideIfNotSearchedFor;
  }

  onToggleUnavailable(): void {
    this.showUnavailable = !this.showUnavailable;
    this.grid.gridOptions.api.onFilterChanged();
  }

  onClearFilterClick() {
    this.showUnavailable = false;
    this.positionFilter = defaultFilter;
    this.anyPositionFilters = false;
    this.grid.gridOptions.api.onFilterChanged();
  }

  isFilterOn(position: PlayerPosition): boolean {
    return this.positionFilter[position];
  }

  toggleFilter(position: PlayerPosition): void {
    this.positionFilter = {
      ...this.positionFilter,
      [position]: !this.positionFilter[position]
    };

    // todo test this still works. used to be (isPositionOn) => isPositionOn instead of identity
    this.anyPositionFilters = some(this.positionFilter, identity);

    this.grid.gridOptions.api.onFilterChanged();
  }

  getQuickFilter() {
    return this.playerSearchQuery;
  }
}
