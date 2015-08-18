/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/firebase/firebase.d.ts" />
/// <reference path="../../typings/rx/rx.d.ts" />

import * as ng from 'angular2/angular2';
import PlayersDA from './dataAccess/playersDA';
import PickList from './pickList/pickList';
import TeamList from './teamList/teamList';


@ng.Component({
  selector: 'app',
  viewInjector: [PlayersDA]
})
@ng.View({
  templateUrl: 'app/app.html',
  directives: [ng.NgFor, PickList, TeamList]
})
class App {
  players: Array<{}>;

  constructor(playersDA: PlayersDA) {
    this.players = playersDA.getPlayers();
  }
}

ng.bootstrap(App);

export default App;