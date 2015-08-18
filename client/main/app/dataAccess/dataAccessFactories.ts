import * as endpoints from './endpoints';
import * as com from 'app/common/common';


export class ObservableFactory {
  newObservablePlayers(): com.IObservedCollection {
    return com.ObservedCollection.fromEndpoint(endpoints.players);
  }

  newObservablePicks(): com.IObservedCollection {
    return com.ObservedCollection.fromEndpoint(endpoints.picks);
  }

  newObservableTeams(): com.IObservedCollection {
    return com.ObservedCollection.fromEndpoint(endpoints.teams);
  }
}