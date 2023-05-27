import { createEffect, createSignal } from "@signals/core";

describe("Signal", () => {
  it("should return value", () => {
    const v = [1, 2];
    const signal = createSignal(v);
    expect(signal.value).toBe(v);
  });

  it("should support .toString()", () => {
    const signal = createSignal(123);
    expect(signal.toString()).toBe("123");
  });

  it("should support .valueOf()", () => {
    const signal = createSignal(123);
    expect(signal).toHaveProperty("valueOf");
    expect(typeof signal.valueOf).toBe("function");
    expect(signal.valueOf()).toBe(123);
    expect(+signal).toBe(123);
  });

  it("should notify other listeners of changes after one listener is disposed", () => {
    const signal = createSignal(0);
    const callback1 = jest.fn(() => signal.value);
    const callback2 = jest.fn(() => signal.value);
    const callback3 = jest.fn(() => signal.value);

    createEffect(callback1);
    const effect = createEffect(callback2);
    createEffect(callback3);

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
    expect(callback3).toBeCalledTimes(1);

    effect.dispose();

    signal.value = 1;
    expect(callback1).toBeCalledTimes(2);
    expect(callback2).toBeCalledTimes(1);
    expect(callback3).toBeCalledTimes(2);
  });

  describe(".peek()", () => {
    it("should get value", () => {
      const s = createSignal(1);
      expect(s.peek()).toBe(1);
    });

    it("should get the updated value after a value change", () => {
      const s = createSignal(1);
      s.value = 2;
      expect(s.peek()).toBe(2);
    });

    it("should not make surrounding effect depend on the signal", () => {
      const s = createSignal(1);
      const callback = jest.fn(() => {
        s.peek();
      });

      createEffect(callback);
      expect(callback).toBeCalledTimes(1);

      s.value = 2;
      expect(callback).toBeCalledTimes(1);
    });
  });
});
