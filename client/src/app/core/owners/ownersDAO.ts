import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IOwner } from './IOwner';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class OwnersDAO {
  ownerUrl = '/owners';

  constructor(private firebase: AngularFireDatabase) {}

  getOwners(): Observable<IOwner[]> {
    return this.firebase.list(this.ownerUrl);
  }
}
