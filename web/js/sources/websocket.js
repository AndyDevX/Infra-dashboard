import { DataSource } from "./base.js";

/** Real data from the Go backend. Reconnects with exponential backoff. */
export class WebSocketSource extends DataSource {
  #ws = null;
  #retry = 0;
  #stopped = false;

  constructor(url) {
    super();
    this.url = url;
  }

  start() {
    this.#stopped = false;
    this.#connect();
  }

  stop() {
    this.#stopped = true;
    this.#ws?.close();
    this.setStatus("down");
  }

  #connect() {
    this.setStatus("connecting");
    const ws = new WebSocket(this.url);
    this.#ws = ws;

    ws.onopen = () => {
      this.#retry = 0;
      this.setStatus("live");
    };
    ws.onmessage = (event) => {
      try {
        this.emit(JSON.parse(event.data));
      } catch (err) {
        console.warn("invalid message from server", err);
      }
    };
    ws.onclose = () => {
      if (this.#stopped) return;
      this.setStatus("down");
      const delay = Math.min(30_000, 1000 * 2 ** this.#retry++);
      setTimeout(() => this.#connect(), delay);
    };
  }
}
