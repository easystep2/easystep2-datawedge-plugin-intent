import { registerPlugin } from '@capacitor/core';

import type { IntentShimPlugin } from './definitions';

const IntentShim = registerPlugin<IntentShimPlugin>('IntentShim', {
  web: () => import('./web').then(m => new m.IntentShimWeb()),
});

export * from './definitions';
export { IntentShim };
