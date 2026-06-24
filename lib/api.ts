const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const TOKEN_KEY = 'pheebemi_token';
const USERNAME_KEY = 'pheebemi_username';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USERNAME_KEY);
}

function setAuth(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
}

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body?.error || '';
  } catch {
    return '';
  }
}

export async function signup(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/signup/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error((await readError(res)) || 'Sign up failed');
  const data = (await res.json()) as { token: string; username: string };
  setAuth(data.token, data.username);
  return data;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error((await readError(res)) || 'Login failed');
  const data = (await res.json()) as { token: string; username: string };
  setAuth(data.token, data.username);
  return data;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export async function sendMessage(
  message: string,
  conversationId: string | null,
  regenerate = false,
) {
  const response = await fetch(`${API_BASE}/api/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
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
  const res = await fetch(`${API_BASE}/api/conversations/${conversationId}/`, {
    headers: authHeaders(),
  });
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
  const res = await fetch(`${API_BASE}/api/conversations/`, { headers: authHeaders() });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json() as Promise<ConversationSummary[]>;
}

export async function deleteConversation(conversationId: string) {
  const res = await fetch(`${API_BASE}/api/conversations/${conversationId}/`, {
    method: 'DELETE',
    headers: authHeaders(),
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
