'use strict';
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var runApplescript = require('run-applescript');
var pify = require('pify');
var rimraf = require('rimraf');
var xdgTrashdir = require('xdg-trashdir');

module.exports = function () {
	if (process.platform === 'darwin') {
		return runApplescript('tell app "Finder" to if (count of items in trash) > 0 then empty trash');
	}

	if (process.platform === 'win32') {
		return pify(childProcess.execFile)(path.join(__dirname, 'lib', 'empty-recycle-bin.exe'));
	}

	return xdgTrashdir().then(function (dir) {
		var paths = [
			path.join(dir, 'files'),
			path.join(dir, 'info')
		];

		return Promise.all(paths.map(function (pth) {
			return pify(fs.readdir)(pth).then(function (files) {
				return Promise.all(files.map(function (file) {
					return pify(rimraf)(path.join(pth, file));
				}));
			});
		}));
	});
};
