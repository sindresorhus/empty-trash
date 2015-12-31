'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');
const runApplescript = require('run-applescript');
const pify = require('pify');
const rimraf = require('rimraf');
const drivelist = require('drivelist');


function getDisks () {
	return new Promise((resolve, reject) =>
		drivelist.list((err, disks) => err ? reject(err) : resolve(disks))
	)
}


function getTrash (disks) {
	let uid = process.getuid();
	let homedir = os.homedir();
	return disks
		.filter(d => !!d.mountpoint)
		.map(d => {
			let mnt = d.mountpoint.replace(/\,$/, '');	// bug in drivelist adds comma to name

			// for root partition - get ~/.local/share/Trash
			if (mnt === '/') return path.join(homedir, '.local', 'share', 'Trash');

			// for other e.g. /mnt/.Trash-1000
			return path.join(mnt, '.Trash-' + uid);
		});
}

function emptyTrash (pth) {
	return pify(fs.readdir)(pth).then(files => {
		let remove = files.map(file => pify(rimraf)(path.join(pth, file)));
		return Promise.all(remove);
	});
}


module.exports = () => {
	if (process.platform === 'darwin') {
		return runApplescript('tell app "Finder" to if (count of items in trash) > 0 then empty trash');
	}

	if (process.platform === 'win32') {
		return pify(childProcess.execFile)(path.join(__dirname, 'lib', 'empty-recycle-bin.exe'));
	}

	return getDisks().then(getTrash).then(trashes =>
		Promise.all(trashes.map(emptyTrash))
	);
};
