import test from 'ava';
import offloadFunction from './index.js';

test('executes a basic function', async t => {
	const result = await offloadFunction(() => 42);
	t.is(result, 42);
});

test('passes arguments to function', async t => {
	const result = await offloadFunction((a, b) => a + b, 2, 3);
	t.is(result, 5);
});

test('returns a string', async t => {
	const result = await offloadFunction(() => 'hello');
	t.is(result, 'hello');
});

test('returns an object', async t => {
	const result = await offloadFunction(() => ({name: 'test', value: 42}));
	t.deepEqual(result, {name: 'test', value: 42});
});

test('returns an array', async t => {
	const result = await offloadFunction(() => [1, 2, 3]);
	t.deepEqual(result, [1, 2, 3]);
});

test('returns null', async t => {
	const result = await offloadFunction(() => null);
	t.is(result, null);
});

test('returns undefined', async t => {
	const result = await offloadFunction(() => undefined);
	t.is(result, undefined);
});

test('handles async function', async t => {
	const result = await offloadFunction(async x => x * 2, 5);
	t.is(result, 10);
});

test('propagates errors', async t => {
	await t.throwsAsync(
		() => offloadFunction(() => {
			throw new Error('test error');
		}),
		{message: 'test error'},
	);
});

test('propagates error name', async t => {
	const error = await t.throwsAsync(
		() => offloadFunction(() => {
			const error = new TypeError('type mismatch');
			throw error;
		}),
	);
	t.is(error.name, 'TypeError');
});

test('handles CPU-intensive work', async t => {
	const result = await offloadFunction(n => {
		let sum = 0;
		for (let i = 0; i < n; i++) {
			sum += i;
		}

		return sum;
	}, 1000);
	t.is(result, 499_500);
});

test('multiple arguments of different types', async t => {
	const result = await offloadFunction(
		(string_, number_, boolean_) => ({string_, number_, boolean_}),
		'hello',
		42,
		true,
	);
	t.deepEqual(result, {string_: 'hello', number_: 42, boolean_: true});
});

test('returns a promise', t => {
	const result = offloadFunction(() => 1);
	t.true(result instanceof Promise);
});

test('handles function with no return value', async t => {
	const result = await offloadFunction(() => {});
	t.is(result, undefined);
});

test('handles nested object arguments', async t => {
	const result = await offloadFunction(
		object => object.nested.value,
		{nested: {value: 'deep'}},
	);
	t.is(result, 'deep');
});

test('handles array arguments', async t => {
	const result = await offloadFunction(
		array => array.reduce((a, b) => a + b, 0),
		[1, 2, 3, 4, 5],
	);
	t.is(result, 15);
});
