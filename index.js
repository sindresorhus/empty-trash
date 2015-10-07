'use strict';
var path = require('path');
var childProcess = require('child_process');
var xdgEmptyTrash = require('xdg-empty-trash');
var runApplescript = require('run-applescript');
var pify = require('pify');

module.exports = function () {
	if (process.platform === 'darwin') {
		return runApplescript('tell app "Finder" to if (count of items in trash) > 0 then empty trash');
	}

	if (process.platform === 'win32') {
		return pify(childProcess.execFile)(path.join(__dirname, 'lib', 'empty-recycle-bin.exe'));
	}

	return pify(xdgEmptyTrash);
};
