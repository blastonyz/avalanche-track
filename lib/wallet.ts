export type Eth = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (ev: string, fn: (...a: never[]) => void) => void;
  removeListener?: (ev: string, fn: (...a: never[]) => void) => void;
};

/** Core Wallet inyecta window.avalanche y/o window.ethereum.
 *  Ojo: un elemento con id="avalanche" también aparece en window.avalanche, por eso se valida request. */
export function getEth(): Eth | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { avalanche?: Eth; ethereum?: Eth };
  const ok = (p?: Eth) => (p && typeof p.request === "function" ? p : undefined);
  return ok(w.avalanche) ?? ok(w.ethereum);
}
