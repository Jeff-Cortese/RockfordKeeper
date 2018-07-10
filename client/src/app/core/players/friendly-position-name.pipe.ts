import { Pipe, PipeTransform } from '@angular/core';

import { IPlayer, PlayerPosition } from './IPlayer';

@Pipe({ name: 'friendlyPositionName' })
export class FriendlyPositionNamePipe implements PipeTransform {
  transform(playerOrPosition: IPlayer | PlayerPosition): string {
    if (!playerOrPosition) { return ''; }

    const position = typeof playerOrPosition === 'string' ? playerOrPosition : playerOrPosition.position;

    switch (position) {
      case 'QB':
        return 'Quarter Back';
      case 'RB':
        return 'Running Back';
      case 'WR':
        return 'Wide Receiver';
      case 'TE':
        return 'Tight End';
      case 'D/ST':
        return 'Defense / Special Teams';
      case 'K':
        return 'Kicker';
      default:
        return '';
    }
  }
}
