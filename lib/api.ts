const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessage(message: string, history: Message[]) {
  const response = await fetch(`${API_BASE}/api/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json() as Promise<{ reply: string }>;
}

export async function getAlphabet() {
  const res = await fetch(`${API_BASE}/api/alphabet/`);
  return res.json();
}

export async function getVocabulary(category?: string) {
  const url = category
    ? `${API_BASE}/api/vocabulary/?category=${encodeURIComponent(category)}`
    : `${API_BASE}/api/vocabulary/`;
  const res = await fetch(url);
  return res.json();
}

export async function getPhrases() {
  const res = await fetch(`${API_BASE}/api/phrases/`);
  return res.json();
}

export async function getNumbers() {
  const res = await fetch(`${API_BASE}/api/numbers/`);
  return res.json();
}
