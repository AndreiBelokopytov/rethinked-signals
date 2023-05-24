import { Signal } from "./Signal";
import { Computed } from "./Computed";
import { Effect } from "./Effect";

describe("Signal", () => {
  it("should return value", () => {
    const v = [1, 2];
    const computed = Computed.create(() => v[0]);
    expect(computed.value).toBe(1);
  });

  it("should update value when dependency changes", () => {
    const signal = Signal.create([1, 2]);
    const computed = Computed.create(() => signal.value[0]);
    signal.value = [3, 4];
    expect(computed.value).toBe(3);
  });

  it("should trigger effect when recomputed", () => {
    const signal = Signal.create([1, 2]);
    const computed = Computed.create(() => signal.value[0]);
    const callback = jest.fn(() => computed.value);
    Effect.create(callback);
    signal.value = [3, 4];
    expect(callback).toBeCalledTimes(2);
  });
});
