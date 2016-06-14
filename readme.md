# empty-trash [![Build Status](https://travis-ci.org/sindresorhus/empty-trash.svg?branch=master)](https://travis-ci.org/sindresorhus/empty-trash)

> Empty the [trash](http://en.wikipedia.org/wiki/Trash_(computing))

Works on macOS, Linux, and Windows.


## Install

```
$ npm install --save empty-trash
```


## Usage

```js
const emptyTrash = require('empty-trash');

emptyTrash().then(() => {
	console.log('done');
});
```


## Info

On macOS, AppleScript is used as it's the only way to do it without incurring permission issues.

On Linux, the [XDG spec](http://standards.freedesktop.org/trash-spec/trashspec-1.0.html) is followed.

On Windows, [`recycle-empty-bin`](https://github.com/sindresorhus/empty-recycle-bin) is used.


## Related

- [empty-trash-cli](https://github.com/sindresorhus/empty-trash-cli) - CLI for this module
- [trash](https://github.com/sindresorhus/trash) - Move files and folders to the trash


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
