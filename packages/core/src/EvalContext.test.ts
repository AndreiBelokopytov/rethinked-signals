import {
  createContext,
  createEffect,
  createSignal,
  getDefaultContext,
  runInTransaction,
} from "@signals/core";

describe("EvalContext", () => {
  it("should batch writes", () => {
    const signal = createSignal("a");
    const callback = jest.fn(() => signal.value);
    createEffect(callback);

    runInTransaction(() => {
      signal.value = "aa";
      signal.value = "aaa";
    });

    expect(callback).toBeCalledTimes(2);
  });

  it("should return default context", () => {
    const contextA = getDefaultContext();
    const contextB = getDefaultContext();
    const contextC = createContext();

    expect(contextA === contextB).toBe(true);
    expect(contextA === contextC).toBe(false);
    expect(contextB === contextC).toBe(false);
  });
});
