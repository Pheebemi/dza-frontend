'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import ConversationSidebar from '@/components/ConversationSidebar';
import {
  sendMessage,
  getConversation,
  listConversations,
  deleteConversation,
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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refreshList = useCallback(() => {
    listConversations()
      .then(setConversations)
      .catch(() => {});
  }, []);

  // Resume a saved conversation + load the sidebar list on first load.
  useEffect(() => {
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
          setMessages([WELCOME, ...data.messages]);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch(() => {
        /* backend unreachable — keep the welcome screen, don't wipe the id */
      })
      .finally(() => setRestoring(false));
  }, [refreshList]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const isNew = !conversationId;

    try {
      const data = await sendMessage(text, conversationId);
      if (isNew) {
        setConversationId(data.conversation_id);
        localStorage.setItem(STORAGE_KEY, data.conversation_id);
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      refreshList();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please check the backend is running.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConversationId(null);
    setMessages([WELCOME]);
    setSidebarOpen(false);
  };

  const handleSelect = async (id: string) => {
    setSidebarOpen(false);
    if (id === conversationId) return;
    try {
      const data = await getConversation(id);
      setConversationId(id);
      localStorage.setItem(STORAGE_KEY, id);
      setMessages([WELCOME, ...data.messages]);
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

  return (
    <div className="flex h-screen flex-col bg-cream">
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
          <div className="chat-scroll flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl px-4 py-6">
              {messages.map((msg, i) => (
                <ChatBubble key={i} role={msg.role} content={msg.content} />
              ))}

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
              <ChatInput onSend={handleSend} disabled={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
