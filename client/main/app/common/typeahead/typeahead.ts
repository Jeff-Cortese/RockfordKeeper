import * as ng from 'angular2/angular2';

@ng.Component({
  selector: 'typeahead'
})
@ng.View({
  template: `<input type="text"/>`
})
class Typeahead {
  constructor(element: ng.ElementRef) {
    $(element.nativeElement.firstChild).typeahead({
      minLength: 2,
      highlight: true
    }, {
      name: 'my-dataset',
      local: ['jeff', '456', '789', '101112'],
      source: function(q, cb) {
        cb(['yay'])
      }
    })

  }
}

export {Typeahead}
