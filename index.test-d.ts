import {expectType} from 'tsd';
import emptyTrash = require('.');

expectType<Promise<void>>(emptyTrash());
