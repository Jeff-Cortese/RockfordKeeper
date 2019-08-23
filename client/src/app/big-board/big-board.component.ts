import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { PicksDAO } from '../core/picks/picksDAO';
import { map, shareReplay, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { drop, groupBy, toPairs } from 'lodash-es';
import { IPick } from '../core/picks/IPick';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-big-board',
  template: `
    <div class="big-board">
      <ng-container *ngIf="currentPick$ | async as currentPick">
        <div class="on-the-clock-list" [style.left.vw]="(currentPick?.overallSelection - 1) * -25">
          <ng-container *ngFor="let pick of allPicks$ | async">
            <span
              class="pick"
              [class.has-player]="pick.player"
              [class.at-bat]="currentPick?.overallSelection === pick.overallSelection"
              [class.on-deck]="(onDeck$ | async)?.overallSelection === pick?.overallSelection"
              [class.in-the-hole]="(inTheHole$ | async)?.overallSelection === pick?.overallSelection"
              [class.clean-up]="(cleanUp$ | async)?.overallSelection === pick?.overallSelection"
            >
              <img src="./assets/{{pick.teamId}}.jpg"
                   [alt]="pick.teamId"
                   width="50"
                   height="50"
              >
              <span style="margin-right: 15px; padding-left: 10px;">
                <div>
                  {{pick.teamId}}
                </div>
                <div>
                  Round {{pick.round}}, Pick {{pick.roundSelection}}
                </div>
              </span>
              <span class="hidden-md-down" style="align-self: flex-end">
                {{pick.isKeeper ? 'KEEPER' : ''}}
              </span>
            </span>
          </ng-container>
        </div>

        <div class="round-header"></div>

        <div class="owners">
          <div class="owner" *ngFor="let team of teamsPicks">
            {{team.teamId}}
          </div>
        </div>

        <div class="picks">
          <div class="round-label" *ngFor="let round of teamsPicks[0].picks; let idx = index">
            {{idx + 1}}
          </div>
          <ng-template #cardTmpl let-context>
            <app-big-board-card
              class="player-card"
              [initialPick]="context.pick"
              [showOwner]="context.atBat || context.onDeck || context.inTheHole || context.cleanup"
              [class.has-player]="context.hasPlayer"
              [class.at-bat]="context.atBat"
              [class.on-deck]="context.onDeck"
              [class.in-the-hole]="context.inTheHole"
              [class.clean-up]="context.cleanup"
            ></app-big-board-card>
          </ng-template>
          <ng-container *ngFor="let team of teamsPicks">
            <ng-container *ngFor="let pick of team.picks; trackBy: trackPickBy">
              <ng-container *ngTemplateOutlet="cardTmpl;
               context: {
                 $implicit: {
                   pick: pick,
                   hasPlayer: currentPick.overallSelection + 4 > pick.overallSelection,
                   atBat: currentPick?.overallSelection === pick.overallSelection,
                   onDeck: (onDeck$ | async)?.overallSelection === pick?.overallSelection,
                   inTheHole: (inTheHole$ | async)?.overallSelection === pick?.overallSelection,
                   cleanup: (cleanUp$ | async)?.overallSelection === pick?.overallSelection,
                   isPrevious: (previousPick$ | async)?.overallSelection === pick.overallSelection
                 }
               }"
              ></ng-container>
            </ng-container>
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./big-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BigBoardComponent implements OnInit, OnDestroy {
  teamsPicks: { teamId: string; picks: IPick[] }[];
  allPicks$ = new ReplaySubject<IPick[]>(1);
  currentPick$: Observable<IPick>;
  previousPick$: Observable<IPick>;
  onDeck$: Observable<IPick>;
  inTheHole$: Observable<IPick>;
  cleanUp$: Observable<IPick>;
  destroy$ = new ReplaySubject(1);

  trackPickBy = (pick: IPick) => pick && pick.overallSelection;

  constructor(private picksDao: PicksDAO) { }

  ngOnInit() {
    this.currentPick$ = this.picksDao.getCurrentPick().pipe(
      map(pick => pick.payload.val()),
      shareReplay(1)
    );

    this.previousPick$ = this.picksDao.getPreviousPick().pipe(
      map(pick => pick.payload.val()),
      shareReplay(1)
    );

    const remainingPicksAfterCurrent$ = this.currentPick$.pipe(
      withLatestFrom(this.allPicks$),
      map(([currentPick, allPicks]) => {
        const picksAfterCurrent = drop(allPicks, currentPick.overallSelection);
        return picksAfterCurrent.filter(pick => !Boolean(pick.player));
      }),
      shareReplay(1)
    );

    this.onDeck$ = remainingPicksAfterCurrent$
      .pipe(map(picks => picks[0]));
    this.inTheHole$ = remainingPicksAfterCurrent$
      .pipe(map(picks => picks[1]));
    this.cleanUp$ = remainingPicksAfterCurrent$
      .pipe(map(picks => picks[2]));

    this.picksDao.getPicks().pipe(
      take(1),
      tap(allPicks => this.allPicks$.next(allPicks.map(pick => pick.payload.val()))),
      map(allPicks => {
        const groupedByTeamId = groupBy(allPicks.map(p => p.payload.val()), pick => pick.teamId);
        const teamsAndPicks = toPairs(groupedByTeamId);
        teamsAndPicks.sort(([, picksA], [, picksB]) => picksA[0].overallSelection - picksB[0].overallSelection);
        return teamsAndPicks.map(([teamId, picks]) => ({ teamId, picks }));
      }),
      tap((teamPicks) => this.teamsPicks = teamPicks),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
