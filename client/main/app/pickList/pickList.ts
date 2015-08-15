import * as ng from 'angular2/angular2';
import * as fire from '../lib/AngularFire';

@ng.Component({
  selector: 'pick-list'
})
@ng.View({
  templateUrl: 'app/pickList/pickList.html',
  directives: [ng.NgFor]
})
class PickList {
  picks: Array<{}>;

  constructor() {
    var fireRef = new fire.AngularFire("https://rockfordkeeper2015.firebaseio.com/picks");
    this.picks = fireRef.asArray().list;
  }
}

export default PickList