'use strict'

import {bootstrap}                                      from './bootstrap.js';
import {isProduction}                                   from './configs/helper/is-production.js';
import {acquireProcessLock}                             from './core/hooks/pre-start/acquire-process-lock.js';
import {initializeSentry}                               from './core/hooks/pre-start/initialize-sentry.js';
import {prettyPrintServiceInformation, printSystemInfo} from './utilities/console-utils';



async function main() {
	await acquireProcessLock();

	if (isProduction()) {
		printSystemInfo();
	}

	prettyPrintServiceInformation();

	initializeSentry();

	await bootstrap();
}

main()
