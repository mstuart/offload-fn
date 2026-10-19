import test from "ava";
import offloadFunction from "./index.js";

for (const reason of [null, undefined, "worker failed", 42, false]) {
  test(`preserves the thrown primitive ${String(reason)} as an error message`, async (t) => {
    const error = await t.throwsAsync(
      offloadFunction((value) => {
        throw value;
      }, reason)
    );
    t.is(error.name, "Error");
    t.is(error.message, String(reason));
  });
}

test("preserves error-like thrown objects", async (t) => {
  const reason = {
    message: "structured failure",
    name: "CustomFailure",
    stack: "original stack",
  };
  const error = await t.throwsAsync(
    offloadFunction((value) => {
      throw value;
    }, reason)
  );
  t.is(error.name, reason.name);
  t.is(error.message, reason.message);
  t.is(error.stack, reason.stack);
});
