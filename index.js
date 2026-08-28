import { Worker } from "node:worker_threads";

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
							cause: (() => {
								if (error.cause === undefined) return undefined;
								try {
									return String(error.cause);
								} catch {
									return '[unserializable cause]';
								}
							})(),
						message: error.message,
						name: error.name,
						stack: error.stack,
					},
				}));
		`;

    const worker = new Worker(workerCode, {
      eval: true,
      workerData: {
        args: arguments_,
        fn: function_.toString(),
      },
    });
    let settled = false;

    worker.on("message", (message) => {
      settled = true;
      if (message.error) {
        const error = new Error(message.error.message);
        if (message.error.cause !== undefined) {
          error.cause = message.error.cause;
        }
        error.name = message.error.name;
        error.stack = message.error.stack;
        reject(error);
      } else {
        resolve(message.result);
      }

      worker.terminate();
    });

    worker.on("error", (error) => {
      settled = true;
      reject(error);
      worker.terminate();
    });

    worker.on("exit", (code) => {
      if (!settled) {
        settled = true;
        reject(
          new Error(`Worker exited before returning a result (code ${code})`)
        );
      }
    });
  });
}
