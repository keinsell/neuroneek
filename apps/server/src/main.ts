import { bootstrap } from './bootstrap.js';
import { isProduction } from './configs/helper/is-production.js';
import { acquireProcessLock } from './hooks/pre-start/acquire-process-lock.js';
import { initializeSentry } from './hooks/pre-start/initialize-sentry.js';
import {
  prettyPrintServiceInformation,
  printSystemInfo,
} from './utilities/console-utils/index.js';

await acquireProcessLock();

if (isProduction()) {
  printSystemInfo();
}

prettyPrintServiceInformation();

initializeSentry();

await bootstrap();
