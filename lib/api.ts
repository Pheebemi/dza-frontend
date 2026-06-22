const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessage(
  message: string,
  conversationId: string | null,
  regenerate = false,
) {
  const response = await fetch(`${API_BASE}/api/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversation_id: conversationId, regenerate }),
  });
  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.error || '';
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail || `API error: ${response.status}`);
  }
  return response.json() as Promise<{ reply: string; conversation_id: string }>;
}

export async function getConversation(conversationId: string) {
  const res = await fetch(`${API_BASE}/api/conversations/${conversationId}/`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json() as Promise<{ conversation_id: string | null; messages: Message[] }>;
}

export interface ConversationSummary {
  id: string;
  title: string;
  updated_at: string;
}

export async function listConversations() {
  const res = await fetch(`${API_BASE}/api/conversations/`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json() as Promise<ConversationSummary[]>;
}

export async function deleteConversation(conversationId: string) {
  const res = await fetch(`${API_BASE}/api/conversations/${conversationId}/`, {
    method: 'DELETE',
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`API error: ${res.status}`);
  }
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
