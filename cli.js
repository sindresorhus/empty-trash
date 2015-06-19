#!/usr/bin/env node
'use strict';
var updateNotifier = require('update-notifier');
var meow = require('meow');
var emptyTrash = require('./');

var cli = meow({
	help: [
		'Usage',
		'  empty-trash'
	]
});

updateNotifier({pkg: cli.pkg}).notify();

emptyTrash(function (err) {
	if (err) {
		console.error(err.message);
		process.exit(1);
	}
});
