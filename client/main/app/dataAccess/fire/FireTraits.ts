import * as rx from 'rx';

class FireObservable {
  static fromEndpoint(endpoint: string, event: string): rx.Observable<any> {
    return FireObservable.toObservable(new Firebase(endpoint), event)
  }

  static toObservable(ref: Firebase, event: string): rx.Observable<any> {
    return Rx.Observable.create(observer => {
      var off = ref.on(event, snap => observer.onNext(snap), e => observer.onError(e));

      return () => ref.off(event, off);
    });
  }

  static toUpdateObservable(ref: Firebase, childId: string, property: string, data: any): rx.Observable<any> {
    return rx.Observable.create(observer => {
      ref.child(childId).child(property).set(data, error => {
        if (!error) {
          observer.onNext({}); //TODO, figure out what to return
        } else {
          observer.onError(error)
        }
      });
    }).take(1);
  }
}

export class FireTraits {
  ref: Firebase;

  constructor(ref: Firebase) {
    this.ref = ref
  }

  getUpdateData(parentId: string, updateData: any) {
    var data = {};
    data[parentId] = updateData;
    return data;
  }

  updateObservable(id, prop, data): rx.Observable<any>  {
    return FireObservable.toUpdateObservable(
      this.ref,
      id, prop, data
      /*this.getUpdateData(id, data)*/
    );
  }
}
