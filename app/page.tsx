import Link from 'next/link';
import Navbar from '@/components/Navbar';

const samplePhrases = [
  { jenjo: 'Səko!', english: 'Hello / Greetings' },
  { jenjo: 'Ba wu bɨ tang', english: "Come, let's eat" },
  { jenjo: 'Fi tswebi və Fangwa', english: 'God loves the world' },
  { jenjo: 'Mɨng', english: 'Water' },
];

const lessons = [
  { href: '/learn/alphabet', label: 'Alphabet', icon: '🔤' },
  { href: '/learn/vocabulary', label: 'Vocabulary', icon: '📖' },
  { href: '/learn/phrases', label: 'Phrases', icon: '💬' },
  { href: '/learn/numbers', label: 'Numbers', icon: '🔢' },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pattern-tile relative overflow-hidden text-paper">
        <div className="absolute inset-0 bg-green/55" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <span className="inline-block rounded-full bg-ochre/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
            Taraba State · Nigeria
          </span>
          <h1 className="animate-rise mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-7xl">
            Səko! <span className="inline-block">👋</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cream/90 sm:text-xl">
            The AI that understands and teaches{' '}
            <span className="font-semibold text-ochre">Jenjo</span> — the living
            voice of the Dza people.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/chat"
              className="w-full rounded-full bg-ochre px-7 py-3.5 text-center font-semibold text-green-deep shadow-lg shadow-green-deep/20 transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Start chatting →
            </Link>
            <Link
              href="/learn"
              className="w-full rounded-full border border-cream/40 px-7 py-3.5 text-center font-semibold text-cream transition-colors hover:bg-cream hover:text-green sm:w-auto"
            >
              Browse lessons
            </Link>
          </div>
        </div>
      </section>

      {/* Sample phrases */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-green">A taste of Jenjo</h2>
          <p className="mt-2 text-muted">Four phrases to get you started</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {samplePhrases.map((p) => (
            <div
              key={p.jenjo}
              className="group rounded-2xl border border-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:border-ochre hover:shadow-md"
            >
              <p className="font-display text-2xl font-bold text-green">{p.jenjo}</p>
              <p className="mt-1 text-muted">{p.english}</p>
            </div>
          ))}
        </div>

        {/* Lesson shortcuts */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {lessons.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-sand/60 px-4 py-6 text-center transition-colors hover:bg-green-soft"
            >
              <span className="text-3xl">{l.icon}</span>
              <span className="font-semibold text-green">{l.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="pattern-strip" />
        <div className="bg-green-deep px-6 py-6 text-center text-sm text-cream/70">
          Built to preserve the Dza language · Taraba State, Nigeria
        </div>
      </footer>
    </div>
  );
}
