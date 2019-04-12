/**
Empty the [trash](https://en.wikipedia.org/wiki/Trash_(computing)).

@example
```
import emptyTrash = require('empty-trash');

(async () => {
	await emptyTrash();
})();
```
*/
declare function emptyTrash(): Promise<void>;

export = emptyTrash;
