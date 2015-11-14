'use strict';
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const runApplescript = require('run-applescript');
const pify = require('pify');
const rimraf = require('rimraf');
const xdgTrashdir = require('xdg-trashdir');

module.exports = () => {
	if (process.platform === 'darwin') {
		return runApplescript('tell app "Finder" to if (count of items in trash) > 0 then empty trash');
	}

	if (process.platform === 'win32') {
		return pify(childProcess.execFile)(path.join(__dirname, 'lib', 'empty-recycle-bin.exe'));
	}

	return xdgTrashdir().then(dir => {
		const paths = [
			path.join(dir, 'files'),
			path.join(dir, 'info')
		];

		return Promise.all(paths.map(pth =>
			pify(fs.readdir)(pth).then(files =>
				Promise.all(files.map(file =>
					pify(rimraf)(path.join(pth, file)))
				)
			)
		));
	});
};
