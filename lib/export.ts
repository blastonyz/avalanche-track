/** Convierte un iterable asíncrono (cursor de Mongo) en un stream: JSON (array) o NDJSON (una línea por item). */
export function streamItems(items: AsyncIterable<unknown>, format: "json" | "ndjson") {
  const enc = new TextEncoder();
  const it = items[Symbol.asyncIterator]();
  let first = true;
  let done = false;
  return new ReadableStream<Uint8Array>({
    async pull(ctrl) {
      if (done) return ctrl.close();
      if (first && format === "json") ctrl.enqueue(enc.encode("[\n"));
      const n = await it.next();
      if (n.done) {
        done = true;
        if (format === "json") ctrl.enqueue(enc.encode(first ? "]\n" : "\n]\n"));
        return ctrl.close();
      }
      const line = JSON.stringify(n.value);
      ctrl.enqueue(enc.encode(format === "json" ? (first ? "" : ",\n") + line : line + "\n"));
      first = false;
    },
    async cancel() {
      await it.return?.();
    },
  });
}
