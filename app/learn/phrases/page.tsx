'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';
import { getPhrases } from '@/lib/api';

interface Phrase {
  jenjo?: string;
  dza?: string;
  phrase?: string;
  english?: string;
  translation?: string;
  category?: string;
  context?: string;
}

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPhrases()
      .then((res) => setPhrases(Array.isArray(res) ? res : []))
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  const grouped = phrases.reduce<Record<string, Phrase[]>>((acc, p) => {
    const cat = p.category || p.context || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="font-display text-4xl font-bold text-green">Common Phrases</h1>
        <p className="mt-2 text-muted">Everyday expressions, grouped by use</p>

        {!loaded ? (
          <Loader />
        ) : (
          <div className="mt-8 space-y-8">
            {Object.entries(grouped).map(([cat, items]) => (
              <section key={cat}>
                <h2 className="mb-3 inline-block rounded-full bg-green-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-green">
                  {cat}
                </h2>
                <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
                  {items.map((p, i) => (
                    <div key={i} className="px-5 py-4">
                      <p className="font-display text-lg font-bold text-green">
                        {p.jenjo || p.dza || p.phrase}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">
                        {p.english || p.translation}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
