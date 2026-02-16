import {expectType, expectError} from 'tsd';
import offloadFunction from './index.js';

expectType<Promise<number>>(offloadFunction(() => 42));
expectType<Promise<string>>(offloadFunction((name: string) => `hello ${name}`, 'world'));
expectType<Promise<number>>(offloadFunction((a: number, b: number) => a + b, 1, 2));

expectError(offloadFunction());
