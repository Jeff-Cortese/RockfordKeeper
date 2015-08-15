import * as ng from 'angular2/angular2';
import * as fire from 'lib/AngularFire';

@ng.Component({
  selector: 'team-list'
})
@ng.View({
  templateUrl: 'teamList/teamList.html',
  directives: [ng.NgFor]
})
class TeamList {
  teams: Array<{}>;

  constructor() {
    var fireRef = new fire.AngularFire("https://rockfordkeeper2015.firebaseio.com/teams");
    this.teams = fireRef.asArray().list;
  }
}

export default TeamList;