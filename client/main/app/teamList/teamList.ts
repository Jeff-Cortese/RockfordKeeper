import * as ng from 'angular2/angular2';
import * as com from '../common/common';
import * as da from '../dataAccess/dataAccess';
import TeamDropDown from '../teamDropDown/teamDropdown';
import {ITeam} from '../contracts/contracts';

@ng.Component({
  selector: 'team-list'
})
@ng.View({
  templateUrl: 'main/app/teamList/teamList.html',
  directives: [ng.coreDirectives, TeamDropDown]
})
class TeamList {
  teams: Array<{}>;
  observableTeams: com.IObservedCollection;

  constructor(teamFactory: da.ObservableFactory) {
    this.observableTeams = teamFactory.newObservableTeams().observe();
    this.teams = this.observableTeams.list;
  }

  onTeamSelected(team: ITeam) {
    console.log(team);
  }

  onTheClockSelected() {
    console.log('on the clock selected');
  }
}

export default TeamList;
