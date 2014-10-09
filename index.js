'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var xdgEmptyTrash = require('xdg-empty-trash');
var runApplescript = require('run-applescript');

module.exports = function (cb) {
	cb = cb || function () {};

	if (process.platform === 'darwin') {
		runApplescript('tell app "Finder" to empty trash', cb);
		return;
	}

	if (process.platform === 'win32') {
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
		return;
	}

	xdgEmptyTrash(cb);
};
