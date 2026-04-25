"use client";

import { useMemo, useState } from "react";

export default function AptosCalculatorPage() {
  const [instructionGas, setInstructionGas] = useState(100000);
  const [storageGas, setStorageGas] = useState(500000);
  const [payloadSize, setPayloadSize] = useState(1000);

  const result = useMemo(() => {
    const basePayloadGas = 1500000;
    const largeTransactionCutoff = 600;
    const extraPayloadGas = Math.max(0, payloadSize - largeTransactionCutoff) * 2000;
    const internalGas = instructionGas + storageGas + basePayloadGas + extraPayloadGas;
    const externalGas = internalGas / 1000000;
    const octas = externalGas * 100;
    return {
      internalGas,
      externalGas,
      apt: octas / 100000000,
    };
  }, [instructionGas, payloadSize, storageGas]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent-strong uppercase">Tool</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight">Aptos Gas Fee Calculator</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
        Estimate Aptos fees from instruction gas, storage gas, and payload size. This is an educational model,
        not a wallet quote.
      </p>
      <div className="mt-10 grid gap-6 rounded-3xl border border-line bg-surface p-6 md:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5">
          {[
            ["Instruction gas", instructionGas, setInstructionGas],
            ["Storage gas", storageGas, setStorageGas],
            ["Payload size bytes", payloadSize, setPayloadSize],
          ].map(([label, value, setter]) => (
            <label key={label as string} className="block">
              <span className="text-sm font-medium">{label as string}</span>
              <input
                type="number"
                value={value as number}
                onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-line bg-background px-4 py-3 outline-none focus:border-accent"
              />
            </label>
          ))}
        </div>
        <div className="rounded-3xl bg-surface-alt p-6">
          <p className="text-sm text-muted">Estimated fee</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight">{result.apt.toFixed(8)} APT</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Internal gas</dt>
              <dd>{result.internalGas.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">External gas</dt>
              <dd>{result.externalGas.toFixed(4)}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="content-flow mt-10 max-w-3xl">
        <h2>Methodology</h2>
        <p>
          The calculator follows the legacy WordPress example: add instruction gas, storage gas, base payload
          gas, and extra payload gas above the large transaction cutoff, then convert to external gas units.
        </p>
      </div>
    </div>
  );
}
