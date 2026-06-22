import Link from 'next/link';
import Navbar from '@/components/Navbar';

const sections = [
  {
    href: '/learn/alphabet',
    title: 'Alphabet',
    desc: 'The letters of the Jenjo script',
    icon: '🔤',
    accent: 'bg-clay-soft',
  },
  {
    href: '/learn/vocabulary',
    title: 'Vocabulary',
    desc: 'Words by category: body, animals, food & more',
    icon: '📖',
    accent: 'bg-green-soft',
  },
  {
    href: '/learn/phrases',
    title: 'Phrases',
    desc: 'Common expressions and greetings',
    icon: '💬',
    accent: 'bg-ochre-soft',
  },
  {
    href: '/learn/numbers',
    title: 'Numbers',
    desc: 'Count 1–20 in Jenjo',
    icon: '🔢',
    accent: 'bg-sand',
  },
];

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="font-display text-4xl font-bold text-green">Learn Jenjo</h1>
        <p className="mt-2 text-muted">Pick a topic to start learning</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-start gap-4 rounded-2xl border border-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:border-ochre hover:shadow-md"
            >
              <span
                className={`grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl text-2xl ${s.accent}`}
              >
                {s.icon}
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-green">{s.title}</h2>
                <p className="mt-1 text-sm text-muted">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
