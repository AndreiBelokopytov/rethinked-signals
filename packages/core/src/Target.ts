import {Callback, Disposable, Source} from "./types";

export class Target implements Disposable {
    private _isDisposed = false
    protected _sources = new Set<Source<unknown>>();

    get isDisposed() {
        return this._isDisposed;
    }

    protected _callback?: WeakRef<Callback>;

    notify() {
        this._clearDependencies();
        const callback = this._callback?.deref()
        if (!callback) {
            this._isDisposed = true;
            return;
        }
        callback();
    }

    dispose(): void {
        this._isDisposed = true;
    }

    addDependency(source: Source<unknown>) {
        this._sources.add(source);
    }

    hasDependency(source: Source<unknown>) {
        return this._sources.has(source);
    }

    setCallback(value: Callback) {
        this._callback = new WeakRef<Callback>(value);
    }

    protected _clearDependencies() {
        this._sources = new Set();
    }
}
