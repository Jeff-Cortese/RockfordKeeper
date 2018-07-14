import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { identity, isEmpty, includes, some } from 'lodash-es';
import { IPlayer, PlayerPosition } from '../core/players/IPlayer';

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
  @Input() players: IPlayer[];
  @Input() canMakePick = false;

  @Output() playerClicked = new EventEmitter<IPlayer>();

  showUnavailable = false;
  playerSearchQuery: string;
  positionFilter = defaultFilter;
  anyPositionFilters = false;

  getPlayerId = (player: IPlayer) =>
    player.espnPlayerId

  getRowClass = (player: IPlayer) => ({
    'hide': this.shouldHidePlayer(player),
    'player-taken': player.isTaken
  })

  shouldHidePlayer(player: IPlayer): boolean {
    const hideIfTaken = !this.showUnavailable && player.isTaken;
    const hideIfNotInFilter = this.anyPositionFilters && !this.positionFilter[player.position];
    const hideIfNotSearchedFor = !isEmpty(this.playerSearchQuery) && !includes(player.lowerName, this.playerSearchQuery.toLowerCase());
    return hideIfTaken || hideIfNotInFilter || hideIfNotSearchedFor;
  }

  onToggleUnavailable(): void {
    this.showUnavailable = !this.showUnavailable;
  }

  onClearFilterClick() {
    this.showUnavailable = false;
    this.positionFilter = defaultFilter;
    this.anyPositionFilters = false;
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
  }
}
