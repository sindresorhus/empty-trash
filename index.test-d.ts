import {expectType} from 'tsd';
import emptyTrash from './index.js';

expectType<Promise<void>>(emptyTrash());
