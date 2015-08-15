/// <reference path="../typings/angular2/angular2.d.ts" />

import * as ng from 'angular2/angular2';
import PlayersDA from 'dataAccess/playersDA';
import PickList from 'pickList/pickList';
import TeamList from 'teamList/teamList';

@ng.Component({
  selector: 'app',
  viewInjector: [PlayersDA]
})
@ng.View({
  templateUrl: 'app.html',
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