/* This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.

	Copyright 2020 - 2023, Robin de Gruijter <gruijter@hotmail.com> */

// INSTRUCTIONS FOR TESTING FROM DESKTOP:
// install node (https://nodejs.org)
// install this package: > npm i beeclear
// run the test: > npm test password=energie

'use strict';

const os = require('os');
const BeeClear = require('../beeclear');
const { version } = require('../package.json');
// const util = require('util');

let log = [];
let errorCount = 0;
let t0 = Date.now();
let short = false;
const bc = new BeeClear();

// function to setup the router session
async function setupSession(opts) {
	try {
		log.push('========== STARTING TEST ==========');
		log.push(`Node version: ${process.version}`);
		log.push(`BeeClear package version: ${version}`);
		log.push(`OS: ${os.platform()} ${os.release()}`);
		Object.keys(opts).forEach((opt) => {
			if (opt === 'short') short = opts[opt];
			bc[opt] = opts[opt];
		});
		t0 = Date.now();
		errorCount = 0;
		log.push('t = 0');
	}	catch (error) {
		log.push(error);
		log.push(bc);
	}
}

// function logError(error) {
// 	log.push(error);
// 	const lastResponse = { lastResponse: bc.lastResponse };
// 	log.push(lastResponse);
// 	errorCount += 1;
// 	return {};
// }

async function doTest(opts) {
	try {

		// try to discover
		log.push('trying to discover BeeClear...');
		const info = await bc.discover()
			.catch((error) => {
				log.push('error:', error.message);
				errorCount += 1;
			});
		log.push(`Local IP address: ${info}`);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// for other methods you first need to be logged in.
		log.push('trying to login:');
		const loggedIn = await bc.login(opts);
		log.push(loggedIn);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// get device settings
		log.push('trying to get device information and settings:');
		const settings = await bc.getDeviceInfo()
			.catch((error) => {
				log.push('error:', error.message);
				errorCount += 1;
			});
		log.push(settings);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// get device status
		log.push('trying to get device status:');
		const status = await bc.getStatus()
			.catch((error) => {
				log.push('error:', error.message);
				errorCount += 1;
			});
		log.push(status);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// getInterfaceStatus
		log.push('trying to get network interface status:');
		const interfaceStatus = await bc.getNetwork()
			.catch((error) => {
				log.push('error:', error.message);
				errorCount += 1;
			});
		log.push(interfaceStatus);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// get meter readings
		log.push('trying to get meter readings:');
		const readings = await bc.getMeterReadings(short)
			.catch((error) => {
				log.push('error:', error.message);
				errorCount += 1;
			});
		log.push(readings);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// get firmware list
		log.push('trying to get online firmware list:');
		const fwList = await bc.getFirmwareList()
			.catch((error) => {
				log.push('error:', error.message);
				errorCount += 1;
			});
		log.push(fwList);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// logout
		log.push('trying to logout:');
		const loggedOut = await bc.logout()
			.catch((error) => {
				log.push('error:', error.message);
				errorCount += 1;
			});
		log.push(loggedOut);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// finish test
		bc.lastResponse = '';
		bc.password = '*****';
		delete bc.httpsAgent;
		log.push(bc);
		// log.push(`t = ${(Date.now() - t0) / 1000}`);
		if (errorCount) {
			log.push(`test finished with ${errorCount} errors`);
		} else {
			log.push('test finished without errors :)');
		}

	}	catch (error) {
		log.push(error);
		bc.password = '*****';
		log.push(bc);
	}
}

async function doTest2(opts) {
	try {

		// for other methods you first need to be logged in.
		log.push('trying to login...');
		const loggedIn = await bc.login(opts);
		log.push(loggedIn);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// get Wifi Scan
		// log.push('trying to get wifi scan info');
		// const wifiScanInfo = await bc.getWifiScan()
		// 	.catch((error) => {
		// 		log.push(error.message);
		// 		errorCount += 1;
		// 	});
		// log.push(wifiScanInfo);
		// log.push(`t = ${(Date.now() - t0) / 1000}`);

		// get meter logs
		// log.push('trying to get historic Power log of present month');
		// const logsE = await bc.getLogs({ type: 'electricity_consumed,electricity_produced' })
		// 	.catch((error) => {
		// 		log.push(error.message);
		// 		errorCount += 1;
		// 	});
		// log.push(logsE);
		// log.push(`t = ${(Date.now() - t0) / 1000}`);

		// log.push('trying to get historic Gas log of present month');
		// const logsG = await bc.getLogs({ type: 'gas_consumed' })
		// 	.catch((error) => {
		// 		log.push(error.message);
		// 		errorCount += 1;
		// 	});
		// log.push(logsG);
		// log.push(`t = ${(Date.now() - t0) / 1000}`);

		// finish test
		bc.lastResponse = '';
		bc.password = '*****';
		log.push(bc);
		if (errorCount) {
			log.push(`test finished with ${errorCount} errors`);
		} else {
			log.push('test finished without errors :)');
		}

	}	catch (error) {
		log.push(error);
		log.push(bc);
	}
}

exports.test = async (opts) => {
	log = [];	// empty the log
	try {
		await setupSession(opts);
		await doTest(opts);
		// await doTest2(opts);
		return Promise.resolve(log);
	}	catch (error) {
		return Promise.resolve(log);
	}
};
