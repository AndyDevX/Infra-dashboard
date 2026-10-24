import { MockSource } from "./mock.js";
import { WebSocketSource } from "./websocket.js";

const DEFAULT_WS_URL = "ws://localhost:8080/ws";

/**
 * Picks the data source:
 *   ?demo=1        -> mock
 *   ?ws=ws://host  -> real backend at that URL
 *   *.github.io    -> mock (Pages cannot run the backend)
 *   otherwise      -> real backend at ws://localhost:8080/ws
 */
export function createSource(location = window.location) {
  const params = new URLSearchParams(location.search);
  const wsUrl = params.get("ws");
  if (wsUrl) return { source: new WebSocketSource(wsUrl), mode: "live" };
  if (params.has("demo") || location.hostname.endsWith(".github.io")) {
    return { source: new MockSource(), mode: "demo" };
  }
  return { source: new WebSocketSource(DEFAULT_WS_URL), mode: "live" };
}
