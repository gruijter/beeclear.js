/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.

	Copyright 2020 - 2023, Robin de Gruijter <gruijter@hotmail.com> */

// INSTRUCTIONS FOR TESTING FROM DESKTOP:
// install node (https://nodejs.org)
// install this package: > npm i beeclear
// run the test: > npm test password=energie

'use strict';

const _test = require('./_test');

console.log('Testing now. Hang on.....');

const options = {};
const args = process.argv.slice(2);
Object.keys(args).forEach((arg) => {
	const info = args[arg].split(/=+/g);
	if (info.length === 2) {
		options[info[0]] = info[1].replace(/['"]+/g, '');
	}
});

if (options.port) {
	options.port = Number(options.port);
}

if (options.useTLS) {
	options.useTLS = options.useTLS.toLowerCase() === 'true';
}

if (options.short) {
	options.short = options.short.toLowerCase() === 'true';
}

if (options.timeout) {
	options.timeout = Number(options.timeout);
}

_test.test(options)
	.then((log) => {
		for (let i = 0; i < (log.length); i += 1) {
			console.log(log[i]);
		}
	})
	.catch((error) => console.log(error));
