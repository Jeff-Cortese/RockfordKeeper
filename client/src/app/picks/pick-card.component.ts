import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPick } from '../core/picks/IPick';

@Component({
  moduleId: module.id,
  selector: 'app-pick-card',
  styleUrls: ['pick-card.component.scss'],
  templateUrl: 'pick-card.component.html'
})

export class PickCardComponent implements OnInit {
  @Input() pick: IPick;
  @Input() isCurrentPick: boolean;
  @Output() cardClick = new EventEmitter<IPick>();

  ngOnInit() {}

  onCardClick(event: Event, pick) {
    this.cardClick.emit(pick);
  }
}
