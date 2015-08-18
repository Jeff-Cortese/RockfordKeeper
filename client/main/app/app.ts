/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/firebase/firebase.d.ts" />
/// <reference path="../../typings/rx/rx.d.ts" />

import * as ng from 'angular2/angular2';
import * as com from './common/common';
import * as da from './dataAccess/dataAccess';
import PickList from './pickList/pickList';
import TeamList from './teamList/teamList';


@ng.Component({
  selector: 'app',
  viewInjector: [da.ObservableFactory]
})
@ng.View({
  templateUrl: 'app/app.html',
  directives: [ng.NgFor, PickList, TeamList]
})
class App {
  players: Array<{}>;
  observablePlayers: com.IObservedCollection;

  constructor(playersFactory: da.ObservableFactory) {
    this.observablePlayers = playersFactory.newObservablePlayers().observe();
    this.players = this.observablePlayers.list;
  }
}

ng.bootstrap(App)
  .then(function() {
    console.log('Bootstrap successful');
  }, function(e) {
    console.log(e);
  });

export default App;