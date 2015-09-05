/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/firebase/firebase.d.ts" />
/// <reference path="../../typings/rx/rx.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/typeahead/typeahead.d.ts" />

import * as ng from 'angular2/angular2'; //probably an anti-pattern to use *. So sue me
import * as com from './common/common';
import * as da from './dataAccess/dataAccess';
import {IPick, IPlayer, ITeam} from './contracts/contracts'
import PickList from './pickList/pickList';
import TeamList from './teamList/teamList';
import PlayerList from './playerList/playerList';


@ng.Component({
  selector: 'app',
  bindings: [da.ObservableFactory, da.DataAccessFactory]
})
@ng.View({
  templateUrl: 'main/app/app.html',
  directives: [
    ng.NgFor,
    ng.formDirectives,
    PickList,
    TeamList,
    PlayerList,
    com.SideHeader,
  ]
})
class App {
  drafter: da.Drafter;
  currentPick: number;

  constructor(daFactory: da.DataAccessFactory) {
    this.drafter = daFactory.newDrafter();

    daFactory.newCurrentPick().valueObservable()
      .subscribe(pick => this.currentPick = pick);
  }

  /*draft(pickId, playerId) {
    this.drafter.selectPlayer(<IPick>{key: () => pickId}, <IPlayer>{key: () => playerId})
      .subscribe(() => alert('yay'), e => console.log(e));
  }*/
}

ng.bootstrap(App)
  .then(function() {
    console.log('Bootstrap successful');
  }, function(e) {
    console.log('Bootstrap failed');
    console.log(e);
  });

export default App;
