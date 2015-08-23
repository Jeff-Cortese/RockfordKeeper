import * as ng from 'angular2/angular2';

@ng.Component({
  selector: 'typeahead',
  properties: [
    'quarterbacks',
    'runningbacks',
    'receivers',
    'tightends',
    'defenses',
    'kickers'
  ],
  lifecycle: [ng.LifecycleEvent.onInit]
})
@ng.View({
  template: `<input type="text"/>`
})
class Typeahead {
  elem: ng.ElementRef;
  quarterbacks: Array<any>;
  runningbacks: Array<any>;
  receivers: Array<any>;
  tightends: Array<any>;
  defenses: Array<any>;
  kickers: Array<any>;

  constructor(element: ng.ElementRef) {
    this.elem = element;
  }

  onInit() {
    var display = suggestion => suggestion.name + ' ' + suggestion.team;

    $(this.elem.nativeElement.firstChild).typeahead({
      hint: true,
      minLength: 2,
      highlight: true
    }, {
      name: 'qbs',
      source: this.matchPlayer(this.quarterbacks),
      display: display,
      templates: {
        header: `<header>QB:</header>`
      }
    }, {
      name: 'rbs',
      source: this.matchPlayer(this.runningbacks),
      display: display,
      templates: {
        header: `<header>RB:</header>`
      }
    }, {
      name: 'wrs',
      source: this.matchPlayer(this.receivers),
      display: display,
      templates: {
        header: `<header>WR:</header>`
      }
    }, {
      name: 'tes',
      source: this.matchPlayer(this.tightends),
      display: display,
      templates: {
        header: `<header>TE:</header>`
      }
    }, {
      name: 'dst',
      source: this.matchPlayer(this.defenses),
      display: display,
      templates: {
        header: `<header>DST:</header>`
      }
    }, {
      name: 'k',
      source: this.matchPlayer(this.kickers),
      display: display,
      templates: {
        header: `<header>K:</header>`
      }
    });
  }

  matchPlayer(players: Array<any>) {
    return (query, callback) => {
      var i = 0,
        len = players.length,
        player,
        substrRegex = new RegExp(query, 'i'),
        matches = [];

      //no foreach here; needs to be fast
      for (;i < len; i++) {
        player = players[i];

        if (player.isTaken) { continue; }

        if (substrRegex.test(player.name) ||
            substrRegex.test(player.team)) {
          matches.push(player);
        }
      }

      callback(matches);
    }
  }
}

export {Typeahead}
