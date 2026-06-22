'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/chat', label: 'Chat' },
  { href: '/learn', label: 'Learn' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40">
      <nav className="border-b border-line bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-green font-display text-lg font-bold text-ochre">
              P
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-green">
              Pheebemi
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((l) => {
              const active =
                l.href === '/learn'
                  ? pathname.startsWith('/learn')
                  : pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-green text-paper'
                      : 'text-ink/70 hover:bg-green-soft hover:text-green'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <div className="pattern-strip" />
    </header>
  );
}
