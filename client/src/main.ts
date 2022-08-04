import { AllCommunityModules, ModuleRegistry } from '@ag-grid-community/all-modules';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

ModuleRegistry.registerModules(AllCommunityModules);
platformBrowserDynamic().bootstrapModule(AppModule);
