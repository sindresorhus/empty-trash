import fs from 'fs';
import path from 'path';
import test from 'ava';
import trash from 'trash';
import userHome from 'user-home';
import pathExists from 'path-exists';
import m from '.';

test(async t => {
	const file = 'emptytrashfixture';
	const trashFile = path.join(userHome, '.Trash', file);
	fs.writeFileSync(file, '');
	await trash([file]);
	t.true(pathExists.sync(trashFile));
	await m();
	t.false(pathExists.sync(trashFile));
});
