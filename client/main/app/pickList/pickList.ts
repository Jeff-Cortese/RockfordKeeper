import * as ng from 'angular2/angular2';
import * as com from 'app/common/common';
import * as da from 'app/dataAccess/dataAccess';

@ng.Component({
  selector: 'pick-list'
})
@ng.View({
  templateUrl: 'app/pickList/pickList.html',
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