'use strict';
const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const runApplescript = require('run-applescript');
const rimraf = require('rimraf');
const xdgTrashdir = require('xdg-trashdir');
const pathExists = require('path-exists');
const pFilter = require('p-filter');

const execFileP = promisify(childProcess.execFile);
const readdirP = promisify(fs.readdir);
const rimrafP = promisify(rimraf);

const linuxEmptyTrash = async directory => {
	const files = await readdirP(directory);
	await Promise.all(files.map(file => rimrafP(path.join(directory, file))));
};

const linuxEmptyTrashes = async () => {
	const directories = await pFilter(await xdgTrashdir.all(), pathExists);
	await Promise.all(directories.map(linuxEmptyTrash));
};

module.exports = async () => {
	if (process.platform === 'darwin') {
		await runApplescript('tell app "Finder" to if (count of items in trash) > 0 then empty trash');
		return;
	}

	if (process.platform === 'win32') {
		await execFileP(path.join(__dirname, 'lib/empty-recycle-bin.exe'));
		return;
	}

	await linuxEmptyTrashes();
};
