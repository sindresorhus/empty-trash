'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var linux = require('xdg-empty-trash');
var runApplescript = require('run-applescript');

function osx(cb) {
	runApplescript('tell app "Finder" to empty trash', cb);
}

function win(cb) {
	execFile('./nircmdc.exe', ['emptybin'], {
		cwd: path.join(__dirname, 'vendor')
	}, function (err) {
		// NirCmd exits with this weird code even though it worked
		if (err && err.code !== 4207175) {
			cb(err);
			return;
		}

		cb();
	});
}

module.exports = function (cb) {
	cb = cb || function () {};

	if (process.platform === 'darwin') {
		osx(cb);
		return;
	}

	if (process.platform === 'win32') {
		win(cb);
		return;
	}

	linux(cb);
};
