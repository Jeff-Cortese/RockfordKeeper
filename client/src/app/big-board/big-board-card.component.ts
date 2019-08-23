import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { IPick } from '../core/picks/IPick';
import { PicksDAO } from '../core/picks/picksDAO';
import { Observable, ReplaySubject } from 'rxjs';
import { shareReplay, take, takeUntil, tap } from 'rxjs/operators';

let z = 1;
@Component({
  selector: 'app-big-board-card',
  template: `
    <div class="pick-container" *ngIf="pick$ | async as pick" [style.z-index]="zIndex">
      <div class="unselected" *ngIf="showOwner && !pick.player">
        {{pick.overallSelection}} {{pick.teamId}}
      </div>

      <a class="selection {{pick?.player?.position.replace('/', '')}}"
         *ngIf="pick.player"
         href="https://www.espn.com/nfl/player/news/_/id/{{pick?.player?.espnPlayerId}}"
         target="_blank"
        [ngStyle]="{
          'background-image': getBackgroundImage(pick),
          'transform': getTransformStyle(pick),
          'z-index': zIndex
        }">
        <div class="selection-name">{{pick?.player?.firstName}}</div>
        <div class="selection-name">
          {{pick?.player?.lastName}}
          <span *ngIf="pick?.player?.injuryStatus && pick?.player?.injuryStatus !== 'ACTIVE'"> ({{pick?.player?.injuryStatus[0]}})</span>
        </div>
        <div class="selection-info">{{pick?.player?.position}} - {{pick.player.team}}, {{pick.player.bye}}</div>
      </a>
    </div>
  `,
  styleUrls: ['big-board-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BigBoardCardComponent implements OnInit, OnDestroy {
  @Input() initialPick: IPick;
  @Input() showOwner = false;
  isNew = false;
  pick$: Observable<IPick>;
  destroy$ = new ReplaySubject(1);
  @HostBinding('style.z-index') zIndex = 1;

  constructor(private pickDao: PicksDAO, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.pick$ = this.pickDao.getPick(this.initialPick.overallSelection).pipe(
      shareReplay(1)
    );

    this.pick$.pipe(
      take(1),
      tap(pick => this.isNew = !Boolean(pick.player)),
      takeUntil(this.destroy$)
    ).subscribe();

    this.pick$.pipe(
      tap(pick => {
        if (!this.initialPick.player && pick.player) {
          z++;
          this.zIndex = z;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getBackgroundImage(pick): string {
    return pick && pick.player
      ? pick.player.position !== 'D/ST'
        ? `url("https://a.espncdn.com/i/headshots/nfl/players/full/${pick.player.espnPlayerId}.png")`
        : `url("https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${pick.player.team.toLowerCase()}.png")`
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
