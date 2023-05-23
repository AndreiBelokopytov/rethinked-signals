import { Target } from "./types";

let defaultContext: EvalContext;

export class EvalContext {
  protected _target?: Target;

  static default() {
    if (!defaultContext) {
      defaultContext = new EvalContext();
    }
    return defaultContext;
  }

  get target() {
    return this._target;
  }
}
