export interface IObservedCollection {
  observe() : IObservedCollection;
  unobserve() : IObservedCollection;
  list: Array<any>;
  error: any;
  addedObservable; //todo type
  movedObservable;
  changedObservable;
  removedObservable;
  valueObservable;
  //get, at
}