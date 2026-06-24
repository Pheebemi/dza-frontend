'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, signup } from '@/lib/api';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) await login(username.trim(), password);
      else await signup(username.trim(), password);
      router.push('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="pattern-strip" />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-green font-display text-xl font-bold text-ochre">
              P
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-green">
              Pheebemi
            </span>
          </Link>

          <div className="rounded-3xl border border-line bg-paper p-7 shadow-sm">
            <h1 className="font-display text-2xl font-bold text-green">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {isLogin
                ? 'Log in to continue learning Jenjo.'
                : 'Sign up to start chatting and save your conversations.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink placeholder:text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
                  placeholder="your name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink placeholder:text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
                  placeholder={isLogin ? 'your password' : 'at least 6 characters'}
                />
              </div>

              {error && (
                <p className="rounded-xl border border-clay/40 bg-clay-soft px-3 py-2 text-sm text-clay">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-green py-3 font-semibold text-paper transition-colors hover:bg-green-deep disabled:opacity-60"
              >
                {loading ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-muted">
            {isLogin ? (
              <>
                New here?{' '}
                <Link href="/signup" className="font-semibold text-green hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-green hover:underline">
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
