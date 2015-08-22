import * as ng from 'angular2/angular2';

@ng.Component({
  selector: 'side-header',
  properties: ['header:title']
})
@ng.View({
  template: `
    <section>
      <header *ng-if="header">{{header}}</header>
      <ng-content select="[head]"></ng-content>
      <ng-content select="[body]"></ng-content>
    </section>
  `,
  directives: [ng.NgIf]
})
class SideHeader {
  constructor() {}
}

export {SideHeader}
