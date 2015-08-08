/// <reference path="../typings/angular2/angular2.d.ts" />

import * as ng from 'angular2/angular2';
import * as fire from 'lib/AngularFire';
import PickList from 'pickList/pickList'

@ng.Component({
  selector: 'app'
})
@ng.View({
  templateUrl: 'app.html',
  directives: [ng.NgFor, PickList]
})
export class App {
  fire;
  players:Array<{}>;

  constructor() {
    //var yo = new PickList();
    this.fire = new fire.AngularFire("https://rockfordkeeper2015.firebaseio.com/players");
    this.players = this.fire.asArray().list;
  }
}

ng.bootstrap(App);