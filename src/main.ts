import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { APP_CONFIG } from './environments/environment';

if (APP_CONFIG.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .then(instance => window.addEventListener('beforeunload', (e) => {
    instance.destroy();
  }))
  .catch(err => console.error(err));
