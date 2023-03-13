import { Target } from "./types";

let defaultContext: EvalContext;

export class EvalContext {
  #target?: WeakRef<Target>;

  static default() {
    if (!defaultContext) {
      defaultContext = new EvalContext();
    }
    return defaultContext;
  }

  get target() {
    return this.#target?.deref();
  }

  enter(target: Target) {
    this.#target = new WeakRef(target);
  }

  exit() {
    this.#target = undefined;
  }
}
