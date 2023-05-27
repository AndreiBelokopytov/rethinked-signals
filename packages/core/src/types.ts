export interface Disposable {
  isDisposed: boolean;
  dispose(): void;
}

export type Callback<Value = unknown> = () => Value;

export interface Source<T> {
  value: T;

  peek(): T;
}
