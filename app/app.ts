/// <reference path="../typings/angular2/angular2.d.ts" />

import * as ng from 'angular2/angular2';
import {PlayersDA, IPlayersDA} from 'dataAccess/dataAccess';
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

  constructor(playersDA: IPlayersDA) {
    this.players = playersDA.getPlayers();
  }
}

//ng.bind(IPlayersDA).toClass(PlayersDA);

ng.bootstrap(App);

export default App;
