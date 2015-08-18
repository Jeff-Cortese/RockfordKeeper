import * as ng from 'angular2/angular2';
import * as com from '../common/common';
import * as da from '../dataAccess/dataAccess';

@ng.Component({
  selector: 'team-list'
})
@ng.View({
  templateUrl: 'main/app/teamList/teamList.html',
  directives: [ng.NgFor]
})
class TeamList {
  teams: Array<{}>;
  observableTeams: com.IObservedCollection;

  constructor(teamFactory: da.ObservableFactory) {
    this.observableTeams = teamFactory.newObservableTeams().observe();
    this.teams = this.observableTeams.list;
  }
}

export default TeamList;