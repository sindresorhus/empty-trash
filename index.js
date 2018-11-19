'use strict';
const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const runJxa = require('run-jxa');
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
		await runJxa(`
			const finder = Application('Finder');

			if (finder.trash.items.length > 0) {
				finder.empty();
			}
		`);
		return;
	}

	if (process.platform === 'win32') {
		await execFileP(path.join(__dirname, 'lib/empty-recycle-bin.exe'));
		return;
	}

	await linuxEmptyTrashes();
};
