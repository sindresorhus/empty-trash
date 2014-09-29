'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var trash = require('trash');
var userHome = require('user-home');
var emptyTrash = require('./');

it('empty trash', function (cb) {
	var file = 'emptytrashfixture';
	var trashFile = path.join(userHome, '.Trash', file);

	fs.writeFileSync(file, '');

	trash([file], function (err) {
		assert(!err, err);
		assert(fs.existsSync(trashFile));

		emptyTrash(function () {
			assert(!err, err);
			assert(!fs.existsSync(trashFile));
			cb();
		});
	});
});
