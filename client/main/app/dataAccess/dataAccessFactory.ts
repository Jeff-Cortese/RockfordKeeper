import * as endpoints from './endpoints';
import {IObservedCollection, ObservedCollection} from '../common/common';
import {Drafter} from './drafter';
import {FirePick} from './fire/firePick';
import {FirePlayer} from './fire/firePlayer';


//todo inject endpoints
export class ObservableFactory {
  newObservablePicks(): IObservedCollection {
    return ObservedCollection.fromEndpoint(endpoints.picks);
  }

  newObservableTeams(): IObservedCollection {
    return ObservedCollection.fromEndpoint(endpoints.teams);
  }

  newObservablePlayers(): IObservedCollection {
    return ObservedCollection.fromEndpoint(endpoints.players);
  }

  newObservablePlayersForPosition(posistion: string): IObservedCollection {
    var ref = new Firebase(endpoints.players)
      .orderByChild('position')
      .equalTo(posistion);

    return new ObservedCollection(ref);
  }

  //todo make into hash instead???
  newObservableQBs = () => this.newObservablePlayersForPosition('QB');
  newObservableRBs = () => this.newObservablePlayersForPosition('RB');
  newObservableWRs = () => this.newObservablePlayersForPosition('WR');
  newObservableTEs = () => this.newObservablePlayersForPosition('TE');
  newObservableDSTs = () => this.newObservablePlayersForPosition('DST');
  newObservableKs = () => this.newObservablePlayersForPosition('K');
}

export class DataAccessFactory {
  newDrafter(): Drafter {
    var pickDA = new FirePick(new Firebase(endpoints.picks));
    var playerDA = new FirePlayer(new Firebase(endpoints.players));
    return new Drafter(pickDA, playerDA);
  }
}
