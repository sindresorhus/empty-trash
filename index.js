import process from 'node:process';
import {promisify} from 'node:util';
import childProcess from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runJxa} from 'run-jxa';
import xdgTrashdir from 'xdg-trashdir';
import {pathExists} from 'path-exists';
import pFilter from 'p-filter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execFileP = promisify(childProcess.execFile);

const windowBinaryPath = path.join(__dirname, 'lib/empty-recycle-bin.exe');

const linuxEmptyTrash = async directory => {
	const files = await fs.readdir(directory);
	await Promise.all(files.map(file => fs.rm(path.join(directory, file), {recursive: true})));
};

const linuxEmptyTrashes = async () => {
	const directories = await pFilter(await xdgTrashdir.all(), pathExists);
	await Promise.all(directories.map(directory => linuxEmptyTrash(directory)));
};

export default async function emptyTrash() {
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
		await execFileP(windowBinaryPath);
		return;
	}

	await linuxEmptyTrashes();
}
