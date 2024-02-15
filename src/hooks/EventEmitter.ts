type tCallback = (data: any) => void;

export class EventEmitter {
  #events = new Map();
  #wrappers = new Map();

  on(name: string, callback: tCallback) {
    const events = this.#events.get(name);
    if (!events) this.#events.set(name, [callback]);
    else events.push(callback);
  }

  emit(name: string, data: any) {
    const events = this.#events.get(name);
    if (events) for (const event of events) event(data);
  }

  once(name: string, callback: tCallback) {
    const wrapper = (...args: [any]) => {
      this.remove(name, wrapper);
      callback(...args);
    };
    this.on(name, wrapper);
    this.#wrappers.set(callback, wrapper);
  }

  remove(name: string, f: Function) {
    const event = this.#events.get(name);
    if (!event) return;

    let index = event.indexOf(f);
    if (index !== -1) {
      event.splice(index, 1);
      return;
    }

    const wrapped = this.#wrappers.get(f);
    if (wrapped) {
      index = event.indexOf(wrapped);
      if (index !== -1) event.splice(index, 1);
      if (!event.length) this.#events.delete(name);
    }
  }

  clear(name: string) {
    if (name) this.#events.delete(name);
    else this.#events.clear();
  }

  count(name: string) {
    const events = this.#events.get(name);
    return events ? events.length : 0;
  }

  listeners(name: string) {
    const events = this.#events.get(name);
    return events?.slice();
  }

  names() {
    const keys = this.#events.keys();
    return [...keys];
  }
}