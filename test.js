import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'ava';
import trash from 'trash';
import emptyTrash from './index.js';

test('main', async t => {
	const file = 'empty-trash-fixture';
	const trashFile = path.join(os.homedir(), '.Trash', file);
	fs.writeFileSync(file, '');
	await trash([file]);
	t.true(fs.existsSync(trashFile));
	await emptyTrash();
	t.false(fs.existsSync(trashFile));
});
