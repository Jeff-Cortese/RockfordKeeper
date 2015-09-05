import * as ng from 'angular2/angular2';
import {ITeam} from '../contracts/contracts';

@ng.Component({
  selector: 'team-drop-down',
  properties: [
    'teams',
    'includeOnTheClock',
    'includeNone'
  ],
  events: [
    'onTeamSelected',
    'onNoneSelected',
    'onOnTheClockSelected'
  ]
})
@ng.View({
  template: `
    <div>
      <ul>
        <li *ng-if="includeNone" ng-click="onNoneSelected.next()"></li>
        <li *ng-if="includeOnTheClock" on-click="onOnTheClockSelected.next()">On The Clock</li>
        <li *ng-for="#team of teams" on-click="onTeamSelected.next(team)">{{team.owner}}</li>
      </ul>
    </div>
  `,
  directives: [ng.coreDirectives]
})
class TeamDropDown {
  teams: Array<ITeam> = [];
  includeOnTheClock: boolean = false;
  includeNone: boolean = false;
  onTeamSelected: ng.EventEmitter = new ng.EventEmitter();
  onNoneSelected: ng.EventEmitter = new ng.EventEmitter();
  onOnTheClockSelected: ng.EventEmitter = new ng.EventEmitter();
  selected: any;

  constructor() {
  }
}

export default TeamDropDown
