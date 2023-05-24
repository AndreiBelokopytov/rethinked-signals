import { createSignal, Signal } from "./Signal";
import { createComputed } from "./Computed";
import { createEffect } from "./Effect";

describe("Signal", () => {
  it("should return value", () => {
    const v = [1, 2];
    const computed = createComputed(() => v[0]);
    expect(computed.value).toBe(1);
  });

  it("should update value when dependency changes", () => {
    const signal = createSignal([1, 2]);
    const computed = createComputed(() => signal.value[0]);
    signal.value = [3, 4];
    expect(computed.value).toBe(3);
  });

  it("should trigger effect when recomputed", () => {
    const signal = createSignal([1, 2]);
    const computed = createComputed(() => signal.value[0]);
    const callback = jest.fn(() => computed.value);
    createEffect(callback);
    signal.value = [3, 4];
    expect(callback).toBeCalledTimes(2);
  });
});
