'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');
const runApplescript = require('run-applescript');
const pify = require('pify');
const rimraf = require('rimraf');
const df = require('@sindresorhus/df');

function getTrash(drives) {
	const uid = process.getuid();
	return drives.map(d => {
		// for root partition - get ~/.local/share/Trash
		if (d.mountpoint === '/') {
			return path.join(os.homedir(), '.local', 'share', 'Trash');
		}
		// for other e.g. /mnt/.Trash-1000
		return path.join(d.mountpoint, `.Trash-${uid}`);
	})
	// make sure path exists
	.filter(d => {
		let exists;
		try {
			fs.accessSync(d, fs.F_OK);
			exists = true;
		} catch (e) {
			exists = false;
		}
		return exists;
	});
}

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

	return pify(df)().then(getTrash).then(trashes => Promise.all(trashes.map(emptyTrash)));
};
