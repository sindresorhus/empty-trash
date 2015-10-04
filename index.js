'use strict';
var nircmd = require('nircmd');
var xdgEmptyTrash = require('xdg-empty-trash');
var runApplescript = require('run-applescript');

module.exports = function (cb) {
	cb = cb || function () {};

	if (process.platform === 'darwin') {
		runApplescript('tell app "Finder" to if (count of items in trash) > 0 then empty trash', cb);
		return;
	}

	if (process.platform === 'win32') {
		nircmd('emptybin', function (err) {
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
