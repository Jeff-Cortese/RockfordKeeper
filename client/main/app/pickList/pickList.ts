import * as ng from 'angular2/angular2';
import * as com from '../common/common';
import * as da from '../dataAccess/dataAccess';

@ng.Component({
  selector: 'pick-list'
})
@ng.View({
  templateUrl: 'main/app/pickList/pickList.html',
  directives: [ng.NgFor, com.Typeahead, com.Typeahead]
})
class PickList {
  picks: Array<{}>;
  observablePicks: com.IObservedCollection;
  observableQBs: com.IObservedCollection;
  observableRBs: com.IObservedCollection;
  observableWRs: com.IObservedCollection;
  observableTEs: com.IObservedCollection;
  observableDSTs: com.IObservedCollection;
  observableKs: com.IObservedCollection;

  constructor(factory: da.ObservableFactory) {
    this.observablePicks = factory.newObservablePicks().observe();
    this.picks = this.observablePicks.list;

    this.observableQBs = factory.newObservableQBs().observe();
    this.observableRBs = factory.newObservableRBs().observe();
    this.observableWRs = factory.newObservableWRs().observe();
    this.observableTEs = factory.newObservableTEs().observe();
    this.observableDSTs = factory.newObservableDSTs().observe();
    this.observableKs = factory.newObservableKs().observe();
  }
}

export default PickList
