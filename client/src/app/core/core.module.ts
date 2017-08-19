import { NgModule } from '@angular/core';

import { PicksDAO } from './picks/picksDAO';
import { PlayersDAO } from './players/playersDAO';
import { OwnersDAO } from './owners/ownersDAO';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [OwnersDAO, PicksDAO, PlayersDAO],
})
export class CoreModule {}
