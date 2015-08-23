import * as com from './IObservedCollection'
import * as rx from 'rx';

export class ObservedCollection implements com.IObservedCollection {
  ref: FirebaseQuery;
  addedObservable: rx.Observable<{}>;
  movedObservable: rx.Observable<{}>;
  changedObservable: rx.Observable<{}>;
  removedObservable: rx.Observable<{}>;
  valueObservable: rx.Observable<{}>;

  error: any;
  list: Array<any>;
  private subscriptions: Array<rx.IDisposable>;

  constructor(fireRef: FirebaseQuery) {
    this.ref = fireRef;
    this.list = [];
    this.subscriptions = [];

    var observable = ObservedCollection.toObservable.bind(this, this.ref);
    this.addedObservable = observable('child_added');
    this.movedObservable = observable('child_moved');
    this.changedObservable = observable('child_changed');
    this.removedObservable = observable('child_removed');
    this.valueObservable = observable('value').take(1);
  }

  private static toObservable(ref: FirebaseQuery, event: string) {
    return Rx.Observable.create(observer => {
      var off = ref.on(event, snap => observer.onNext(snap), e => observer.onError(e));

      return () => ref.off(event, off);
    });
  }

  static fromEndpoint(endpoint: string) {
    return new ObservedCollection(new Firebase(endpoint));
  }

  observe() {
    this.list.length = 0;
    this.subscriptions.push(this.addedObservable.subscribe(this.created.bind(this), this.error));
    this.subscriptions.push(this.movedObservable.subscribe(this.moved.bind(this), this.error));
    this.subscriptions.push(this.changedObservable.subscribe(this.updated.bind(this), this.error));
    this.subscriptions.push(this.removedObservable.subscribe(this.removed.bind(this), this.error));

    return this;
  }

  unobserve() {
    this.subscriptions.forEach(obs => obs.dispose());
    this.subscriptions.length = 0;

    return this;
  }

  getItem(recOrIndex: any) {
    var item = recOrIndex;
    if(typeof(recOrIndex) === "number") {
      item = this.getRecord(recOrIndex);
    }
    return item;
  }

  /*getChild(recOrIndex: any) {
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

  bulkUpdate(items) {
   this.ref.update(items);
  }*/

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
    return this.list.find(item => key === item._key);
  }
}
