'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';
import { getNumbers } from '@/lib/api';

interface NumberEntry {
  number?: number;
  numeral?: number;
  value?: number;
  jenjo?: string;
  dza?: string;
  word?: string;
  note?: string;
  pattern?: string;
}

export default function NumbersPage() {
  const [numbers, setNumbers] = useState<NumberEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getNumbers()
      .then((res) => {
        if (Array.isArray(res)) {
          setNumbers(res);
        } else if (res.cardinal) {
          setNumbers(res.cardinal);
        } else {
          setNumbers((Object.values(res).find(Array.isArray) as NumberEntry[]) ?? []);
        }
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="font-display text-4xl font-bold text-green">Numbers</h1>
        <p className="mt-2 text-muted">
          Note: 6 = “sibling of 1”, 7 = “sibling of 2”, and so on.
        </p>

        {!loaded ? (
          <Loader />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {numbers.map((entry, i) => {
              const num = entry.number ?? entry.numeral ?? entry.value ?? i + 1;
              const word = entry.jenjo || entry.dza || entry.word || '—';
              const note = entry.note || entry.pattern;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-2xl border border-line bg-paper p-5 text-center transition-all hover:-translate-y-0.5 hover:border-ochre hover:shadow-md"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-green font-display text-xl font-bold text-ochre">
                    {num}
                  </span>
                  <p className="mt-3 font-display text-lg font-bold text-green">{word}</p>
                  {note && <p className="mt-0.5 text-xs text-muted">{note}</p>}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
