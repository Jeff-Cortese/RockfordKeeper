import * as endpoints from './endpoints';
import {IObservedCollection, ObservedCollection} from '../common/common';
import Drafter from './drafter';
import FirePick from './fire/firePick';
import FirePlayer from './fire/firePlayer';


//todo inject endpoints
export class ObservableFactory {
  newObservablePlayers(): IObservedCollection {
    return ObservedCollection.fromEndpoint(endpoints.players);
  }

  newObservablePicks(): IObservedCollection {
    return ObservedCollection.fromEndpoint(endpoints.picks);
  }

  newObservableTeams(): IObservedCollection {
    return ObservedCollection.fromEndpoint(endpoints.teams);
  }
}

export class DataAccessFactory {
  newDrafter(): Drafter {
    var pickDA = new FirePick(new Firebase(endpoints.picks));
    var playerDA = new FirePlayer(new Firebase(endpoints.players));
    return new Drafter(pickDA, playerDA);
  }
}
