import { EvalContext } from "./EvalContext";
import { MutableLinkedList } from "./utils";
import { Source, Target } from "./types";

export class Signal<T> implements Source<T> {
  _targets = new MutableLinkedList<Target>();

  static create<T>(value: T) {
    const signal = new Signal(value, EvalContext.default());
    return signal;
  }

  get value() {
    const target = this._context.target;
    if (target && !target.hasDependency(this)) {
      this._targets.add(target);
      target.addDependency(this);
    }
    return this._value;
  }

  set value(nextValue: T) {
    this._value = nextValue;
    this._targets = this._notifyTagets();
  }

  constructor(private _value: T, protected _context: EvalContext) {}

  toString() {
    return String(this.value);
  }

  valueOf() {
    return this._value;
  }

  protected _notifyTagets() {
    const activeTargets = new MutableLinkedList<Target>();
    for (const target of this._targets) {
      if (!target.isDisposed && target.hasDependency(this)) {
        activeTargets.add(target);
        target.notify();
      }
    }
    return activeTargets;
  }
}
