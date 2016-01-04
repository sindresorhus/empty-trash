'use strict';
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const runApplescript = require('run-applescript');
const pify = require('pify');
const rimraf = require('rimraf');
const xdgTrashdir = require('xdg-trashdir');
const pathExists = require('path-exists');

function emptyTrash(pth) {
	return pify(fs.readdir)(pth)
		.then(files => Promise.all(files.map(file => pify(rimraf)(path.join(pth, file)))));
}

module.exports = () => {
	if (process.platform === 'darwin') {
		return runApplescript('tell app "Finder" to if (count of items in trash) > 0 then empty trash');
	}

	if (process.platform === 'win32') {
		return pify(childProcess.execFile)(path.join(__dirname, 'lib', 'empty-recycle-bin.exe'));
	}

	return xdgTrashdir.all()
		.then(dirs => dirs.filter(pathExists.sync))
		.then(dirs => Promise.all(dirs.map(emptyTrash)));
};
