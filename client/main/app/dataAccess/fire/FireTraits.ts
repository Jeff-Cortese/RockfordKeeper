import * as rx from 'rx';

class FireObservable {
  static toObservable(ref: Firebase, event: string): rx.Observable<any> {
    return Rx.Observable.create(observer => {
      // todo snap.val() here? what if i want to transform it or keyify it
      var off = ref.on(event, snap => observer.onNext(snap.val()), e => observer.onError(e));

      return () => ref.off(event, off);
    });
  }
}

export class FireTraits {
  ref: Firebase;

  constructor(ref: Firebase) {
    this.ref = ref;
  }

  valueObservable(): rx.Observable<any> {
    return FireObservable.toObservable(this.ref, 'value');
  }

  update(properties, value): rx.Observable<any> {
    let props = properties.split('.');

    let updateRef =
      props.reduce(
        (accumulatorRef, property) => property ? accumulatorRef.child(property) : accumulatorRef,
        this.ref
      );

    return rx.Observable.create(observer => {
      updateRef.set(value, error => {
        if (!error) {
          observer.onNext(value); //TODO, figure out what to return
        } else {
          observer.onError(error);
        }
      });
    }).take(1);
  }

}
