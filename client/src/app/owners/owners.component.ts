import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IOwner } from '../core/owners/IOwner';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss']
})
export class OwnersComponent implements OnInit {
  @Input() owners: IOwner[];

  @Output() ownerChanged = new EventEmitter<IOwner>();

  constructor() { }

  ngOnInit() {
  }

  onSelectedOwnerChange(event): void {
    console.log(event);
  }
}
