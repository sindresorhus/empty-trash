import fs from 'fs';
import path from 'path';
import test from 'ava';
import trash from 'trash';
import userHome from 'user-home';
import pathExists from 'path-exists';
import fn from '.';

test(async t => {
	const file = 'emptytrashfixture';
	const trashFile = path.join(userHome, '.Trash', file);
	fs.writeFileSync(file, '');
	await trash([file]);
	t.true(pathExists.sync(trashFile));
	await fn();
	t.false(pathExists.sync(trashFile));
});
