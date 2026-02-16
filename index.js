import {Worker} from 'node:worker_threads';

export default function offloadFunction(function_, ...arguments_) {
	return new Promise((resolve, reject) => {
		const workerCode = `
			const {parentPort, workerData} = require('node:worker_threads');
			const fn = eval('(' + workerData.fn + ')');
			Promise.resolve()
				.then(() => fn(...workerData.args))
				.then(result => parentPort.postMessage({result}))
				.catch(error => parentPort.postMessage({
					error: {
						message: error.message,
						name: error.name,
						stack: error.stack,
					},
				}));
		`;

		const worker = new Worker(workerCode, {
			eval: true,
			workerData: {
				fn: function_.toString(),
				args: arguments_,
			},
		});

		worker.on('message', message => {
			if (message.error) {
				const error = new Error(message.error.message);
				error.name = message.error.name;
				error.stack = message.error.stack;
				reject(error);
			} else {
				resolve(message.result);
			}

			worker.terminate();
		});

		worker.on('error', error => {
			reject(error);
			worker.terminate();
		});
	});
}
