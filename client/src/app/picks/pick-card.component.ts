import { Component, Input, OnInit } from '@angular/core';
import { IPick } from '../core/picks/IPick';

@Component({
  moduleId: module.id,
  selector: 'app-pick-card',
  templateUrl: 'pick-card.component.html'
})

export class PickCardComponent implements OnInit {
  @Input() pick: IPick;

  ngOnInit() {}
}
