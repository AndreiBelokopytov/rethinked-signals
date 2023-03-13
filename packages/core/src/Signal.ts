import { EvalContext } from "./EvalContext";
import { MutableLinkedList } from "./utils";
import { Source, Target } from "./types";

export class Signal<T> implements Source<T> {
  #value: T;
  #context: EvalContext;
  #targets = new MutableLinkedList<Target>();

  static create<T>(value: T) {
    const signal = new Signal(value, EvalContext.default());
    return signal;
  }

  get value() {
    const target = this.#context.target;
    if (target && !target.hasDependency(this)) {
      this.#targets.add(target);
      target.addDependecy(this);
    }
    return this.#value;
  }

  set value(nextValue: T) {
    this.#value = nextValue;
    this.#targets = this.#notifyTargets();
  }

  constructor(value: T, context: EvalContext) {
    this.#value = value;
    this.#context = context;
  }

  toString() {
    return String(this.value);
  }

  valueOf() {
    return this.#value;
  }

  #notifyTargets() {
    const notifiedTargets = new MutableLinkedList<Target>();
    for (const target of this.#targets) {
      if (!target.isDisposed && target.hasDependency(this)) {
        target.notify();
        notifiedTargets.add(target);
      }
    }
    return notifiedTargets;
  }
}
