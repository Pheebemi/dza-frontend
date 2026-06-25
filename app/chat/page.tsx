'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import ConversationSidebar from '@/components/ConversationSidebar';
import {
  sendMessage,
  getConversation,
  listConversations,
  deleteConversation,
  getToken,
  ConversationSummary,
  Message,
} from '@/lib/api';

const STORAGE_KEY = 'pheebemi_conversation_id';

const WELCOME: Message = {
  role: 'assistant',
  content:
    "Səko! I'm Pheebemi, your Jenjo language tutor.\n\nAsk me anything in English and I'll teach you how to say it in Jenjo, or type Jenjo and I'll explain it!",
};

const SUGGESTIONS = [
  'How do I say hello?',
  'Teach me to count to five',
  'What does "Mɨng" mean?',
];

type UiMessage = Message & { isError?: boolean };

export default function ChatPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([WELCOME]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const skipAutoScroll = useRef(false);
  const instantScroll = useRef(false);
  const typeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter: reveal the assistant reply progressively (~1s regardless of length).
  const animateReply = useCallback((fullText: string) => {
    setStreaming(true);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', created_at: new Date().toISOString() },
    ]);
    const total = fullText.length;
    const chunk = Math.max(2, Math.ceil(total / 60));
    let i = 0;
    const tick = () => {
      i = Math.min(total, i + chunk);
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.role === 'assistant') {
          copy[copy.length - 1] = { ...last, content: fullText.slice(0, i) };
        }
        return copy;
      });
      if (i < total) {
        typeTimer.current = setTimeout(tick, 16);
      } else {
        setStreaming(false);
      }
    };
    tick();
  }, []);

  // Clear any in-flight typewriter on unmount.
  useEffect(() => () => {
    if (typeTimer.current) clearTimeout(typeTimer.current);
  }, []);

  const refreshList = useCallback(() => {
    listConversations()
      .then(setConversations)
      .catch(() => {});
  }, []);

  // Require login: redirect to /login if there's no token.
  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setAuthed(true);
  }, [router]);

  // Resume a saved conversation + load the sidebar list on first load.
  useEffect(() => {
    if (!authed) return;
    refreshList();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setRestoring(false);
      return;
    }
    getConversation(saved)
      .then((data) => {
        if (data.messages.length > 0) {
          setConversationId(saved);
          instantScroll.current = true;
          setMessages([WELCOME, ...data.messages]);
          setHasMore(data.has_more);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch(() => {
        /* backend unreachable — keep the welcome screen, don't wipe the id */
      })
      .finally(() => setRestoring(false));
  }, [authed, refreshList]);

  useEffect(() => {
    // Don't yank to the bottom when we just prepended older messages.
    if (skipAutoScroll.current) {
      skipAutoScroll.current = false;
      return;
    }
    // Jump instantly on first load/open; smooth-scroll for new messages after.
    const behavior = instantScroll.current ? 'auto' : 'smooth';
    instantScroll.current = false;
    bottomRef.current?.scrollIntoView({ behavior });
  }, [messages, loading]);

  // Load the previous batch when the user scrolls near the top.
  const loadOlder = useCallback(async () => {
    if (loadingOlder || !hasMore || !conversationId) return;
    const firstReal = messages.find((m) => m.id != null);
    if (!firstReal?.id) return;
    setLoadingOlder(true);
    const el = scrollRef.current;
    const prevHeight = el?.scrollHeight ?? 0;
    try {
      const data = await getConversation(conversationId, firstReal.id);
      skipAutoScroll.current = true;
      setMessages((prev) => [prev[0], ...data.messages, ...prev.slice(1)]);
      setHasMore(data.has_more);
      // keep the viewport anchored on the message the user was reading
      requestAnimationFrame(() => {
        if (el) el.scrollTop = el.scrollHeight - prevHeight;
      });
    } catch {
      /* ignore */
    } finally {
      setLoadingOlder(false);
    }
  }, [loadingOlder, hasMore, conversationId, messages]);

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollTop < 80) loadOlder();
  };

  const runTurn = async (text: string, regenerate: boolean) => {
    setLoading(true);
    const isNew = !conversationId;
    try {
      const data = await sendMessage(text, conversationId, regenerate);
      if (isNew) {
        setConversationId(data.conversation_id);
        localStorage.setItem(STORAGE_KEY, data.conversation_id);
      }
      refreshList();
      animateReply(data.reply);
    } catch (err) {
      const content =
        err instanceof Error && err.message
          ? err.message
          : 'Sorry, something went wrong. Please check the backend is running.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content, isError: true, created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text, created_at: new Date().toISOString() },
    ]);
    runTurn(text, false);
  };

  const handleRetry = () => {
    if (loading) return;
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    const last = messages[messages.length - 1];
    const lastWasError = last?.role === 'assistant' && last.isError === true;
    // Drop the trailing assistant message (the error or the previous answer).
    setMessages((prev) => {
      const copy = [...prev];
      if (copy[copy.length - 1]?.role === 'assistant') copy.pop();
      return copy;
    });
    // If the previous answer succeeded it was saved server-side → ask the
    // backend to replace it (regenerate). If it errored, nothing was saved → resend.
    runTurn(lastUser.content, !lastWasError);
  };

  const handleNewChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConversationId(null);
    setMessages([WELCOME]);
    setHasMore(false);
    setSidebarOpen(false);
  };

  const handleSelect = async (id: string) => {
    setSidebarOpen(false);
    if (id === conversationId) return;
    try {
      const data = await getConversation(id);
      setConversationId(id);
      localStorage.setItem(STORAGE_KEY, id);
      instantScroll.current = true;
      setMessages([WELCOME, ...data.messages]);
      setHasMore(data.has_more);
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteConversation(id);
    } catch {
      refreshList(); // restore on failure
    }
    if (id === conversationId) handleNewChat();
  };

  const showSuggestions = messages.length === 1 && !loading && !restoring;

  if (!authed) return null;

  return (
    <div className="flex h-dvh flex-col bg-cream">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <ConversationSidebar
          conversations={conversations}
          activeId={conversationId}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={handleSelect}
          onNew={handleNewChat}
          onDelete={handleDelete}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          {/* Sub-header */}
          <div className="border-b border-line bg-cream/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open conversations"
                  className="rounded-lg p-1.5 text-muted hover:bg-green-soft hover:text-green lg:hidden"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-muted">
                  {conversationId ? 'Saved conversation' : 'New conversation'}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} onScroll={handleScroll} className="chat-scroll flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl px-4 py-6">
              {(loadingOlder || hasMore) && (
                <div className="mb-4 flex justify-center">
                  <span className="text-xs text-muted">
                    {loadingOlder ? 'Loading earlier messages…' : 'Scroll up for earlier messages'}
                  </span>
                </div>
              )}

              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id ?? `local-${msg.role}-${msg.created_at ?? 'welcome'}`}
                  role={msg.role}
                  content={msg.content}
                  isError={msg.isError}
                  createdAt={msg.created_at}
                />
              ))}

              {!loading &&
                !streaming &&
                messages.length > 1 &&
                messages[messages.length - 1].role === 'assistant' && (
                  <div className="mb-4 flex">
                    <button
                      onClick={handleRetry}
                      className="ml-10 flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-ochre hover:text-green"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Retry
                    </button>
                  </div>
                )}

              {loading && (
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-green font-display text-sm font-bold text-ochre">
                    P
                  </span>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-3.5">
                    <span className="typing-dot h-2 w-2 rounded-full bg-green [animation-delay:0ms]" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-green [animation-delay:200ms]" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-green [animation-delay:400ms]" />
                  </div>
                </div>
              )}

              {showSuggestions && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-green transition-colors hover:border-ochre hover:bg-ochre-soft"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-line bg-cream/90 backdrop-blur-md">
            <div className="mx-auto max-w-2xl">
              <ChatInput onSend={handleSend} disabled={loading || streaming} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
