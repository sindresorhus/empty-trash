import fs from 'fs';
import os from 'os';
import path from 'path';
import test from 'ava';
import trash from 'trash';
import pathExists from 'path-exists';
import emptyTrash from '.';

test('main', async t => {
	const file = 'empty-trash-fixture';
	const trashFile = path.join(os.homedir(), '.Trash', file);
	fs.writeFileSync(file, '');
	await trash([file]);
	t.true(pathExists.sync(trashFile));
	await emptyTrash();
	t.false(pathExists.sync(trashFile));
});
