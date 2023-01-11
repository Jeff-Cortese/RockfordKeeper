import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IPlayer } from '../core/players/IPlayer';

@Component({
  moduleId: module.id,
  selector: 'app-roster-card',
  styleUrls: ['./roster-card.component.css'],
  templateUrl: 'roster-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RosterCardComponent {
  @Input() cardTitle: string;
  @Input() player: IPlayer;
}
