#!/usr/bin/env node
'use strict';
var updateNotifier = require('update-notifier');
var argv = require('minimist')(process.argv.slice(2));
var pkg = require('./package.json');
var emptyTrash = require('./');
var input = argv._;

function help() {
	console.log([
		'',
		'  ' + pkg.description,
		'',
		'  Usage',
		'    empty-trash'
	].join('\n'));
}

updateNotifier({
	packageName: pkg.name,
	packageVersion: pkg.version
}).notify();

if (argv.version) {
	console.log(pkg.version);
	return;
}

if (argv.help) {
	help();
	return;
}

emptyTrash(function (err) {
	if (err) {
		console.error(err.message);
		process.exit(1);
	}
});
