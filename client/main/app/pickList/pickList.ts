import * as ng from 'angular2/angular2';
import * as com from '../common/common';
import * as da from '../dataAccess/dataAccess';

@ng.Component({
  selector: 'pick-list'
})
@ng.View({
  templateUrl: 'main/app/pickList/pickList.html',
  directives: [ng.NgFor]
})
class PickList {
  picks: Array<{}>;
  observablePicks: com.IObservedCollection;

  constructor(picksFactory: da.ObservableFactory) {
    this.observablePicks = picksFactory.newObservablePicks().observe();
    this.picks = this.observablePicks.list;
  }
}

export default PickList