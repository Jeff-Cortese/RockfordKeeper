import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IPick } from '../core/picks/IPick';

@Component({
  moduleId: module.id,
  selector: 'app-pick-card',
  styleUrls: ['pick-card.component.scss'],
  templateUrl: 'pick-card.component.html'
})

export class PickCardComponent implements OnChanges {
  @Input() pick: IPick;
  @Input() isCurrentPick: boolean;
  @Input() canAutoScroll = true;
  @Output() cardClick = new EventEmitter<IPick>();
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
    this.cardClick.emit(pick);
  }
}
