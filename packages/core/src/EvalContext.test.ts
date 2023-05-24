import { Signal } from "./Signal";
import { Effect } from "./Effect";
import { EvalContext } from "./EvalContext";

describe("EvalContext", () => {
  it("should batch writes", () => {
    const signal = Signal.create("a");
    const callback = jest.fn(() => signal.value);
    Effect.create(callback);

    EvalContext.default().runInTransaction(() => {
      signal.value = "aa";
      signal.value = "aaa";
    });

    expect(callback).toBeCalledTimes(2);
  });
});
