export class AngularFire {
  static asArray(ref: Firebase) {
    return new FirebaseArray(this.ref);
  }
}


export class FirebaseArray<T> {
  ref: Firebase;
  error: any;
  list: Array<T>;

  constructor(ref: Firebase) {
    this.ref = ref;
    this.list = [];

    // listen for changes at the Firebase instance
    Rx.Observable.fromEvent(this.ref.orderByChild('teamId'), 'child_added')
      .subscribe(this.created.bind(this), this.error);

    Rx.Observable.fromEvent(this.ref, 'child_moved')
      .subscribe(this.moved.bind(this), this.error);

    Rx.Observable.fromEvent(this.ref, 'child_changed')
      .subscribe(this.updated.bind(this), this.error);

    Rx.Observable.fromEvent(this.ref, 'child_removed')
      .subscribe(this.removed.bind(this), this.error);

    // determine when initial load is completed
    Rx.Observable.fromEvent(this.ref, 'value')
      .take(1).subscribe(() => console.log('loaded'))
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