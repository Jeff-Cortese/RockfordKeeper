/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/firebase/firebase.d.ts" />
/// <reference path="../../typings/rx/rx.d.ts" />

import * as ng from 'angular2/angular2';
import * as com from './common/common';
import * as da from './dataAccess/dataAccess';
import PickList from './pickList/pickList';
import TeamList from './teamList/teamList';
import PlayerList from './playerList/playerList';


@ng.Component({
  selector: 'app',
  viewInjector: [da.ObservableFactory]
})
@ng.View({
  templateUrl: 'main/app/app.html',
  directives: [ng.NgFor, PickList, TeamList, PlayerList]
})
class App {
  constructor() {}
}

ng.bootstrap(App)
  .then(function() {
    console.log('Bootstrap successful');
  }, function(e) {
    console.log(e);
  });

export default App;