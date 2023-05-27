import {
  createComputed,
  createEffect,
  createSignal,
  Source,
} from "@signals/core";

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

  it("should detect simple dependency cycles", () => {
    const a: Source<unknown> = createComputed(() => a.peek());
    expect(() => a.peek()).toThrow(/Cycle detected/);
  });

  it("should detect deep dependency cycles", () => {
    const a: Source<unknown> = createComputed(() => b.value);
    const b: Source<unknown> = createComputed(() => c.value);
    const c: Source<unknown> = createComputed(() => d.value);
    const d: Source<unknown> = createComputed(() => a.peek());
    expect(() => a.peek()).toThrow(/Cycle detected/);
  });

  it("should not make surrounding effect depend on the computed", () => {
    const s = createSignal(1);
    const c = createComputed(() => s.value);
    const callback = jest.fn(() => {
      c.peek();
    });

    createEffect(callback);
    expect(callback).toBeCalledTimes(1);

    s.value = 2;
    expect(callback).toBeCalledTimes(1);
  });

  it("should not make surrounding effect depend on the peeked computed's dependencies", () => {
    const a = createSignal(1);
    const b = createComputed(() => a.value);
    const callback = jest.fn();
    createEffect(() => {
      callback();
      b.peek();
    });
    expect(callback).toBeCalledTimes(1);

    a.value = 1;
    expect(callback).toBeCalledTimes(1);
  });
});
