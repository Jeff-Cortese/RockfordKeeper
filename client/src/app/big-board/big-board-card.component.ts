import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IPick } from '../core/picks/IPick';
import { PicksDAO } from '../core/picks/picksDAO';
import { fromEvent, Observable } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-big-board-card',
  template: `
    <div class="pick-container" *ngIf="pick$ | async as pick">
      <div class="unselected" *ngIf="showOwner && !pick.player">
        {{pick.overallSelection}} {{pick.teamId}}
      </div>

      <div class="selection" *ngIf="pick.player"
        [ngStyle]="{
          'background-image': getBackgroundImage(pick),
          'transform': getTransformStyle(pick)
        }">
        <div class="selection-name">{{pick?.player?.firstName}}</div>
        <div class="selection-name">{{pick?.player?.lastName}}</div>
        <div class="selection-info">{{pick?.player?.position}} - {{pick.player.team}}, {{pick.player.bye}}</div>
      </div>
    </div>
  `,
  styleUrls: ['big-board-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BigBoardCardComponent implements OnInit {
  @Input() initialPick: IPick;
  @Input() showOwner = false;
  isNew = false;
  pick$: Observable<IPick>;

  constructor(private pickDao: PicksDAO) {}

  ngOnInit() {
    this.pick$ = this.pickDao.getPick(this.initialPick.overallSelection).pipe(
      shareReplay(1)
    );

    this.pick$.pipe(
      take(1),
      tap(pick => this.isNew = !Boolean(pick.player))
    ).subscribe();
  }

  getBackgroundImage(pick): string {
    return pick && pick.player
      ? `url("https://a.espncdn.com/i/headshots/nfl/players/full/${pick.player.espnPlayerId}.png")`
      : '';
  }

  getXTranslation(pick: IPick): number {
    const isRoundBackwards = pick.round % 2 === 0;
    const translation = 8.3 * (pick.roundSelection - 6) * (isRoundBackwards ? 1 : -1);
    return translation + (4.16 * (isRoundBackwards ? -1 : 1));
  }

  getYTranslation(pick: IPick): number {
    return -5.88 * (pick.round - 8.5);
  }

  getTransformStyle(pick: IPick) {
    return `translate(${this.isNew ? this.getXTranslation(pick) : 0}vw, ${this.isNew ? this.getYTranslation(pick) : 0}vh) scale(${this.isNew ? 4 : 1})`;
  }
}
