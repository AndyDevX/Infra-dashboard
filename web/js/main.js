import { createSource } from "./sources/index.js";

const out = document.getElementById("out");
const statusEl = document.getElementById("status");

const { source, mode } = createSource();

source.onStatus((status) => {
  statusEl.textContent = `${mode} · ${status}`;
});

source.subscribe((msg) => {
  out.textContent = JSON.stringify(msg, null, 2);
});

source.start();
