import * as ng from 'angular2/angular2';
import * as com from 'app/common/common';
import * as da from 'app/dataAccess/dataAccess';

@ng.Component({
  selector: 'team-list'
})
@ng.View({
  templateUrl: 'app/teamList/teamList.html',
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