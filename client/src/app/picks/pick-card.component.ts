import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output,
  SimpleChanges
} from '@angular/core';
import { IPick } from '../core/picks/IPick';
import { SnapshotAction } from 'angularfire2/database';

@Component({
  moduleId: module.id,
  selector: 'app-pick-card',
  templateUrl: 'pick-card.component.html',
  styleUrls: ['pick-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PickCardComponent implements OnChanges {
  @Input() pick: SnapshotAction<IPick>;
  @Input() isCurrentPick: boolean;
  @Input() canAutoScroll = true;
  @Input() canClick = false;
  @Input() canDoActions = false;

  @Output() cardClick = new EventEmitter<SnapshotAction<IPick>>();
  @Output() autoScroll = new EventEmitter();

  constructor(private element: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const autoScroll = () => {
      if (!this.canAutoScroll || !this.isCurrentPick) { return; }
      const nativeElement = this.element.nativeElement;
      const parentElement = nativeElement.parentElement;

      this.autoScroll.emit();
      setTimeout(() => {
        parentElement.scrollLeft = nativeElement.offsetLeft - 275;
      }, 100);
    };

    if (changes && changes.isCurrentPick && changes.isCurrentPick.currentValue) {
      autoScroll();
    }

    if (changes && changes.canAutoScroll && changes.canAutoScroll.currentValue) {
      autoScroll();
    }
  }

  onCardClick(pick): void {
    if (!this.canClick) { return; }

    this.cardClick.emit(pick);
  }
}
