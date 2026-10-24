/** Common plumbing for data sources. See docs/CONTRACT.md. */
export class DataSource {
  #handlers = new Set();
  #statusHandlers = new Set();

  subscribe(handler) {
    this.#handlers.add(handler);
    return () => this.#handlers.delete(handler);
  }

  onStatus(handler) {
    this.#statusHandlers.add(handler);
    return () => this.#statusHandlers.delete(handler);
  }

  emit(message) {
    this.#handlers.forEach((h) => h(message));
  }

  setStatus(status) {
    this.#statusHandlers.forEach((h) => h(status));
  }

  start() {
    throw new Error("not implemented");
  }

  stop() {
    throw new Error("not implemented");
  }
}
