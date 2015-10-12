import fs from 'fs';
import path from 'path';
import test from 'ava';
import trash from 'trash';
import userHome from 'user-home';
import pathExists from 'path-exists';
import fn from '.';

test(t => {
	const file = 'emptytrashfixture';
	const trashFile = path.join(userHome, '.Trash', file);

	fs.writeFileSync(file, '');

	trash([file], err => {
		t.ifError(err);
		t.true(pathExists.sync(trashFile));

		fn().then(() => {
			t.ifError(err);
			t.false(pathExists.sync(trashFile));
			t.end();
		});
	});
});
