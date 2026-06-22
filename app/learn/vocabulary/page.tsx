'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';
import { getVocabulary } from '@/lib/api';

const CATEGORIES = [
  'body_parts', 'animals', 'nature', 'food', 'people',
  'colors', 'verbs', 'adjectives', 'places', 'abstract', 'religious',
];

interface VocabEntry {
  jenjo?: string;
  dza?: string;
  english?: string;
  meaning?: string;
  word?: string;
}

export default function VocabularyPage() {
  const [category, setCategory] = useState('body_parts');
  const [data, setData] = useState<VocabEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setData([]);
    setLoaded(false);
    getVocabulary(category)
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, [category]);

  const filtered = data.filter((entry) => {
    const jenjo = entry.jenjo || entry.dza || entry.word || '';
    const eng = entry.english || entry.meaning || '';
    const q = search.toLowerCase();
    return jenjo.toLowerCase().includes(q) || eng.toLowerCase().includes(q);
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="font-display text-4xl font-bold text-green">Vocabulary</h1>
        <p className="mt-2 text-muted">Browse words by category</p>

        {/* Category chips */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                category === cat
                  ? 'bg-green text-paper'
                  : 'border border-line bg-paper text-ink/70 hover:border-green hover:text-green'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search words…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-line bg-paper py-3 pl-11 pr-4 text-ink placeholder:text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          />
        </div>

        {!loaded ? (
          <Loader />
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((entry, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-ochre"
                >
                  <p className="font-display text-lg font-bold text-green">
                    {entry.jenjo || entry.dza || entry.word}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{entry.english || entry.meaning}</p>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="mt-12 text-center text-muted">
                {search ? `No results for “${search}”` : 'No words in this category.'}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
