# offload-fn

> Run a function in a Worker thread and get back a promise

## Install

```sh
npm install offload-fn
```

## Usage

```js
import offloadFunction from 'offload-fn';

const result = await offloadFunction((a, b) => a + b, 2, 3);
//=> 5

// CPU-intensive work
const sum = await offloadFunction(n => {
	let total = 0;
	for (let i = 0; i < n; i++) {
		total += i;
	}
	return total;
}, 1_000_000);
```

## API

### offloadFunction(function_, ...arguments_)

Returns a `Promise` that resolves with the function's return value.

Serializes the function to a string and runs it inside a `Worker` thread. Arguments and return values must be serializable via the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

#### function_

Type: `Function`

The function to execute in a Worker thread.

#### arguments_

Type: `unknown[]`

Arguments to pass to the function.

### Limitations

- The function **cannot reference closure variables** — it is serialized to a string.
- Arguments must be serializable (structured clone).
- The return value must be serializable (structured clone).

## Related

- [perf-fn](https://github.com/mstuart/perf-fn) - Measure function execution time

## License

MIT
