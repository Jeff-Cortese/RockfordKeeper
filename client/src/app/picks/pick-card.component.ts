import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPick } from '../core/picks/IPick';

@Component({
  moduleId: module.id,
  selector: 'app-pick-card',
  templateUrl: 'pick-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PickCardComponent implements OnInit {
  @Input() pick: IPick;
  @Output() removePlayerClick = new EventEmitter<IPick>();

  ngOnInit() {}
}
