import { createEffect } from "./Effect";
import { createSignal } from "./Signal";
import Mock = jest.Mock;

describe("effect", () => {
  it("should init with value", () => {
    const s = createSignal(123);
    const callback = jest.fn(() => s.value);
    createEffect(callback);

    expect(callback).toBeCalled();
    expect(callback).toReturnWith(123);
  });

  it("should be disposable", () => {
    const s = createSignal(123);
    const callback = jest.fn(() => s.value);
    const effect = createEffect(callback);
    effect.dispose();
    expect(effect.isDisposed).toBe(true);
  });

  it("should subscribe to signals", () => {
    const signal = createSignal(123);
    const callback = jest.fn(() => signal.value);
    createEffect(callback);

    signal.value = 42;
    expect(callback).toBeCalledTimes(2);
    expect(callback).toReturnWith(42);
  });

  it("should subscribe to multiple signals", () => {
    const signalA = createSignal("a");
    const signalB = createSignal("b");
    const callback = jest.fn(() => signalA.value + " " + signalB.value);
    createEffect(callback);

    signalA.value = "aa";
    signalB.value = "bb";
    expect(callback).toReturnWith("aa bb");
  });

  it("should dispose of subscriptions", () => {
    const signalA = createSignal("a");
    const signalB = createSignal("b");
    const callback = jest.fn(() => signalA.value + " " + signalB.value);
    const effect = createEffect(callback);

    effect.dispose();
    expect(callback).toBeCalledTimes(1);

    signalA.value = "aa";
    signalB.value = "bb";
    expect(callback).toBeCalledTimes(1);
  });

  it("should unsubscribe from signal", () => {
    const signal = createSignal(123);
    const callback = jest.fn(() => signal.value);
    const effect = createEffect(callback);

    effect.dispose();
    signal.value = 42;
    expect(callback).toBeCalledTimes(1);
  });

  it("should conditionally unsubscribe from signals", () => {
    const signalA = createSignal("a");
    const signalB = createSignal("b");
    const signalC = createSignal(true);

    const callback = jest.fn(() => {
      return signalC.value ? signalA.value : signalB.value;
    });

    createEffect(callback);
    expect(callback).toBeCalledTimes(1);

    signalB.value = "bb";
    expect(callback).toBeCalledTimes(1);

    signalC.value = false;
    expect(callback).toBeCalledTimes(2);

    signalA.value = "aaa";
    expect(callback).toBeCalledTimes(2);
  });

  it("should batch writes", () => {
    const signal = createSignal("a");
    const callback = jest.fn(() => signal.value);
    createEffect(callback);

    createEffect(() => {
      signal.value = "aa";
      signal.value = "aaa";
    });

    expect(callback).toBeCalledTimes(2);
  });

  it("should dispose when callback is removed", () => {
    const signal = createSignal("a");
    let callback: Mock | undefined = jest.fn(() => signal.value);
    const effect = createEffect(callback);

    expect(callback).toBeCalledTimes(1);

    callback = undefined;
    signal.value = "b";

    expect(effect.isDisposed);
  });
});
