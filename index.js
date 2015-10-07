'use strict';
var path = require('path');
var childProcess = require('child_process');
var xdgEmptyTrash = require('xdg-empty-trash');
var runApplescript = require('run-applescript');

module.exports = function (cb) {
	cb = cb || function () {};

	if (process.platform === 'darwin') {
		runApplescript('tell app "Finder" to if (count of items in trash) > 0 then empty trash', cb);
	} else if (process.platform === 'win32') {
		var bin = path.join(__dirname, 'vendor', 'empty-recycle-bin.exe');
		childProcess.execFile(bin, function (err) {
			cb(err);
		});
	} else {
		xdgEmptyTrash(cb);
	}
};
