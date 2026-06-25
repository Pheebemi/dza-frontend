'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

// Minimal typing for the Web Speech API (not in the default TS lib).
interface SpeechRecognitionEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const ctorRef = useRef<SpeechRecognitionCtor | null>(null);
  const baseRef = useRef('');

  // Detect speech-recognition support (Chrome/Edge; not Firefox/most Safari).
  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (Ctor) {
      ctorRef.current = Ctor;
      setVoiceSupported(true);
    }
    return () => recognitionRef.current?.stop();
  }, []);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  useEffect(resize, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    recognitionRef.current?.stop();
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (disabled || !ctorRef.current) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new ctorRef.current();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    baseRef.current = value ? value.trimEnd() + ' ' : '';
    rec.onresult = (e) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setValue(baseRef.current + transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  return (
    <div className="flex items-end gap-2 p-3">
      <textarea
        ref={ref}
        rows={1}
        placeholder={listening ? 'Listening… speak now' : 'Type in English or Jenjo…'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-[0.95rem] leading-relaxed text-ink placeholder:text-muted focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20 disabled:opacity-60"
      />

      {voiceSupported && (
        <button
          onClick={toggleListening}
          disabled={disabled}
          aria-label={listening ? 'Stop voice input' : 'Speak (English)'}
          title="Speak in English"
          className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            listening
              ? 'animate-pulse bg-clay text-paper'
              : 'border border-line bg-paper text-muted hover:border-green hover:text-green'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
            <path
              d="M5 11a7 7 0 0 0 14 0M12 18v3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-green text-paper transition-colors hover:bg-green-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10.2 15 12 3.4 13.8z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
