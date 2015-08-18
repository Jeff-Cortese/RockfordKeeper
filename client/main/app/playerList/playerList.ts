import * as ng from 'angular2/angular2';
import * as com from 'app/common/common';
import * as da from 'app/dataAccess/dataAccess';

@ng.Component({
  selector: 'player-list'
})
@ng.View({
  templateUrl: 'app/playerList/playerList.html',
  directives: [ng.NgFor]
})
class PlayerList {
  players: Array<{}>;
  observablePlayers: com.IObservedCollection;

  constructor(teamFactory: da.ObservableFactory) {
    this.observablePlayers = teamFactory.newObservablePlayers().observe();
    this.players = this.observablePlayers.list;
  }
}

export default PlayerList;