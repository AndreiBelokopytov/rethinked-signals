import { Callback } from "./types";
import { Computed } from "./Computed";
import { EvalContext } from "./EvalContext";
import { Signal } from "./Signal";
import { Effect } from "./Effect";

export * from "./types";

export function createSignal<Value>(
  value: Value,
  context: EvalContext = EvalContext.default()
) {
  return new Signal(value, context);
}

export function createComputed<Value>(
  callback: Callback<Value>,
  context: EvalContext = EvalContext.default()
) {
  return new Computed(callback, context);
}

export function createEffect(
  callback: Callback,
  context: EvalContext = EvalContext.default()
) {
  const effect = new Effect(callback, context);
  effect.run();
  return effect;
}

export function runInTransaction(
  callback: Callback,
  context: EvalContext = EvalContext.default()
) {
  context.runInTransaction(callback);
}

export function createContext() {
  return new EvalContext();
}

export function getDefaultContext() {
  return EvalContext.default();
}
