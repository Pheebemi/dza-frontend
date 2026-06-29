'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUsername, logout } from '@/lib/api';

const links = [
  { href: '/chat', label: 'Chat' },
  { href: '/learn', label: 'Learn' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getUsername());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('pheebemi_conversation_id');
    setUsername(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40">
      <nav className="border-b border-line bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Pheebemi" width={36} height={36} priority className="h-9 w-9" />
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

            {username ? (
              <div className="ml-1 flex items-center gap-2 border-l border-line pl-2">
                <span className="hidden text-sm font-medium text-muted sm:inline">
                  {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-clay-soft hover:text-clay"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-1 rounded-full border border-green px-4 py-2 text-sm font-semibold text-green transition-colors hover:bg-green hover:text-paper"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div className="pattern-strip" />
    </header>
  );
}
