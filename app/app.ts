/// <reference path="../typings/angular2/angular2.d.ts" />

import * as ng from 'angular2/angular2';
import * as fire from 'lib/AngularFire';
import PickList from 'pickList/pickList';
import TeamList from 'teamList/teamList';

@ng.Component({
  selector: 'app'
})
@ng.View({
  templateUrl: 'app.html',
  directives: [ng.NgFor, PickList, TeamList]
})
export class App {
  players:Array<{}>;

  constructor() {
    var fireRef = new fire.AngularFire("https://rockfordkeeper2015.firebaseio.com/players");
    this.players = fireRef.asArray().list;
  }
}

ng.bootstrap(App);