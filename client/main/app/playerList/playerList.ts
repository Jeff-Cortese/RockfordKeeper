import * as ng from 'angular2/angular2';
import * as com from '../common/common';
import * as da from '../dataAccess/dataAccess';

@ng.Component({
  selector: 'player-list'
})
@ng.View({
  templateUrl: 'main/app/playerList/playerList.html',
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