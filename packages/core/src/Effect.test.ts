import { Effect } from "./Effect";
import { Signal } from "./Signal";

describe("effect", () => {
  it("should init with value", () => {
    const s = Signal.create(123);
    const callback = jest.fn(() => s.value);
    Effect.create(callback);

    expect(callback).toBeCalled();
    expect(callback).toReturnWith(123);
  });

  it("should subscribe to signals", () => {
    const signal = Signal.create(123);
    const callback = jest.fn(() => signal.value);
    Effect.create(callback);

    signal.value = 42;
    expect(callback).toBeCalledTimes(2);
    expect(callback).toReturnWith(42);
  });

  it("should subscribe to multiple signals", () => {
    const signalA = Signal.create("a");
    const signalB = Signal.create("b");
    const callback = jest.fn(() => signalA.value + " " + signalB.value);
    Effect.create(callback);

    signalA.value = "aa";
    signalB.value = "bb";
    expect(callback).toReturnWith("aa bb");
  });

  it("should dispose of subscriptions", () => {
    const signalA = Signal.create("a");
    const signalB = Signal.create("b");
    const callback = jest.fn(() => signalA.value + " " + signalB.value);
    const dispose = Effect.create(callback);

    dispose();
    expect(callback).toBeCalledTimes(1);

    signalA.value = "aa";
    signalB.value = "bb";
    expect(callback).toBeCalledTimes(1);
  });

  it("should unsubscribe from signal", () => {
    const signal = Signal.create(123);
    const callback = jest.fn(() => signal.value);
    const unsubscribe = Effect.create(callback);

    unsubscribe();
    signal.value = 42;
    expect(callback).toBeCalledTimes(1);
  });

  it("should conditionally unsubscribe from signals", () => {
    const signalA = Signal.create("a");
    const signalB = Signal.create("b");
    const signalC = Signal.create(true);

    const callback = jest.fn(() => {
      return signalC.value ? signalA.value : signalB.value;
    });

    Effect.create(callback);
    expect(callback).toBeCalledTimes(1);

    signalB.value = "bb";
    expect(callback).toBeCalledTimes(1);

    signalC.value = false;
    expect(callback).toBeCalledTimes(2);

    signalA.value = "aaa";
    expect(callback).toBeCalledTimes(2);
  });

  it("should batch writes", () => {
    const signal = Signal.create("a");
    const callback = jest.fn(() => signal.value);
    Effect.create(callback);

    Effect.create(() => {
      signal.value = "aa";
      signal.value = "aaa";
    });

    expect(callback).toBeCalledTimes(2);
  });
});
