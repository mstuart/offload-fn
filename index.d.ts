/**
Run a function in a Worker thread and get back a promise.

The function cannot reference closure variables. Arguments and return values must be serializable via the structured clone algorithm.

@param function_ - The function to execute in a Worker thread.
@param arguments_ - Arguments to pass to the function.
@returns A promise that resolves with the function's return value.

@example
```
import offloadFunction from 'offload-fn';

const result = await offloadFunction((a, b) => a + b, 2, 3);
//=> 5
```
*/
export default function offloadFunction<Arguments extends unknown[], ReturnType>(
	function_: (...arguments_: Arguments) => ReturnType,
	...arguments_: Arguments
): Promise<Awaited<ReturnType>>;
