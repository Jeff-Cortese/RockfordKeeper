import { NgModule } from '@angular/core';

import { PicksDAO } from './picks/picksDAO';
import { PlayersDAO } from './players/playersDAO';
import { OwnersDAO } from './owners/ownersDAO';
import { FriendlyPositionNamePipe } from './players/friendly-position-name.pipe';

@NgModule({
  imports: [],
  exports: [FriendlyPositionNamePipe],
  declarations: [FriendlyPositionNamePipe],
  providers: [OwnersDAO, PicksDAO, PlayersDAO, FriendlyPositionNamePipe],
})
export class CoreModule {}
