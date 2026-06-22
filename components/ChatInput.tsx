'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (ref.current) ref.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3">
      <textarea
        ref={ref}
        rows={1}
        placeholder="Type in English or Jenjo…"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          resize();
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-[0.95rem] leading-relaxed text-ink placeholder:text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 disabled:opacity-60"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-green text-paper transition-colors hover:bg-green-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3.4 20.4 21 12 3.4 3.6 3.4 10.2 15 12 3.4 13.8z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
