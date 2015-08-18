import * as com from './IObservedCollection'

class ObservableFireCollection {
  ref;
  addedObservable;
  movedObservable;
  changedObservable;
  removedObservable;
  valueObservable;

  constructor(fireRef: Firebase) {
    this.ref = fireRef;
    var observable = Rx.Observable.fromEvent.bind(this, this.ref);
    this.addedObservable = observable('child_added');
    this.movedObservable = observable('child_moved');
    this.changedObservable = observable('child_changed');
    this.removedObservable = observable('child_removed');
    this.valueObservable = observable('value').take(1);
  }
}

// theres really no reason for this to be a subclass
export class ObservedCollection extends ObservableFireCollection implements com.IObservedCollection{
  error: any;
  list: Array<any>;

  constructor(ref: Firebase) {
    super(ref);
    this.list = [];
  }

  static fromEndpoint(endpoint: string) {
    return new this(new Firebase(endpoint));
  }

  observe() {
    this.addedObservable.subscribe(this.created.bind(this), this.error);
    this.movedObservable.subscribe(this.moved.bind(this), this.error);
    this.changedObservable.subscribe(this.updated.bind(this), this.error);
    this.removedObservable.subscribe(this.removed.bind(this), this.error);
    return this;
  }

  getItem(recOrIndex: any) {
    var item = recOrIndex;
    if(typeof(recOrIndex) === "number") {
      item = this.getRecord(recOrIndex);
    }
    return item;
  }

  getChild(recOrIndex: any) {
    var item = this.getItem(recOrIndex);
    return this.ref.child(item._key);
  }

  add(rec: any) {
    this.ref.push(rec);
  }

  remove(recOrIndex: any) {
    this.getChild(recOrIndex).remove();
  }

  save(recOrIndex: any) {
    var item = this.getItem(recOrIndex);
    this.getChild(recOrIndex).update(item);
  }

  keyify(snap) {
    var item = snap.val();
    item._key = snap.key();
    return item;
  }

  created(snap) {
    var addedValue = this.keyify(snap);
    this.list.push(addedValue);
  }

  moved(snap) {
    var key = snap.key();
    this.spliceOut(key);
  }

  updated(snap) {
    var key = snap.key();
    var indexToUpdate = this.indexFor(key);
    this.list[indexToUpdate] = this.keyify(snap);
  }

  removed(snap) {
    var key = snap.key();
    this.spliceOut(key);
  }

  bulkUpdate(items) {
    this.ref.update(items);
  }

  spliceOut(key) {
    var i = this.indexFor(key);
    if( i > -1 ) {
      return this.list.splice(i, 1)[0];
    }
    return null;
  }

  indexFor(key) {
    var record = this.getRecord(key);
    return this.list.indexOf(record);
  }

  getRecord(key) {
    return this.list.find((item) => key === item._key);
  }
}