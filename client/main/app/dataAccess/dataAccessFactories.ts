import * as endpoints from './endpoints';
import { IObservedCollection, ObservedCollection } from 'app/common/common';

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