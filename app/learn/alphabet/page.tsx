'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';
import { getAlphabet } from '@/lib/api';

interface AlphabetEntry {
  letter?: string;
  character?: string;
  example?: string;
  example_word?: string;
  meaning?: string;
  english?: string;
}

export default function AlphabetPage() {
  const [data, setData] = useState<AlphabetEntry[]>([]);
  const [selected, setSelected] = useState<AlphabetEntry | null>(null);

  useEffect(() => {
    getAlphabet().then(setData).catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="font-display text-4xl font-bold text-green">Jenjo Alphabet</h1>
        <p className="mt-2 text-muted">Tap a letter to see an example word</p>

        {data.length === 0 ? (
          <Loader />
        ) : (
          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {data.map((entry, i) => {
              const letter = entry.letter || entry.character || '?';
              return (
                <button
                  key={i}
                  onClick={() => setSelected(entry)}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-paper py-5 transition-all hover:-translate-y-0.5 hover:border-ochre hover:shadow-md"
                >
                  <span className="font-display text-2xl font-bold text-green">{letter}</span>
                  <span className="max-w-full truncate px-2 text-xs text-muted">
                    {entry.example || entry.example_word || ''}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="animate-rise w-full max-w-xs rounded-3xl border border-line bg-paper p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-display text-7xl font-bold text-green">
              {selected.letter || selected.character}
            </p>
            {(selected.example || selected.example_word) && (
              <p className="mt-4 text-xl font-semibold text-ink">
                {selected.example || selected.example_word}
              </p>
            )}
            {(selected.meaning || selected.english) && (
              <p className="mt-1 text-muted">{selected.meaning || selected.english}</p>
            )}
            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-full bg-green py-3 font-semibold text-paper transition-colors hover:bg-green-deep"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
