import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
  createdAt?: string;
}

// Jenjo-specific characters (special letters + combining diacritics). Any word
// containing one is a Jenjo word, so we bold it (which the theme renders green)
// — independent of whether the AI model bolded it.
const JENJO_RE = /[ɨəɛɔŋɓɗʃʒɣ̀-ͯ]/;

function highlightJenjo(md: string): string {
  // Leave existing **bold** and `code` spans untouched; only touch plain text.
  return md
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .map((seg) => {
      if (seg.startsWith('**') || seg.startsWith('`')) return seg;
      return seg.replace(/[\p{L}\p{M}ʼ'’]+/gu, (w) => (JENJO_RE.test(w) ? `**${w}**` : w));
    })
    .join('');
}

// Markdown elements styled to match the warm theme.
const mdComponents: Components = {
  p: ({ children }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-green">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-ochre-soft px-1.5 py-0.5 text-[0.85em] font-medium text-green">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-sand p-3 text-[0.85em] last:mb-0">
      {children}
    </pre>
  ),
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-green underline">
      {children}
    </a>
  ),
  h1: ({ children }) => <h3 className="mb-1 mt-2 font-display text-lg font-bold text-green">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-1 mt-2 font-display text-base font-bold text-green">{children}</h3>,
  h3: ({ children }) => <h3 className="mb-1 mt-2 font-display text-base font-bold text-green">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-ochre pl-3 italic text-muted">{children}</blockquote>
  ),
};

export default function ChatBubble({ role, content, isError, createdAt }: ChatBubbleProps) {
  const isUser = role === 'user';

  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      className={`animate-rise mb-4 flex items-start gap-2.5 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green font-display text-sm font-bold text-ochre">
          P
        </span>
      )}

      <div className={`flex max-w-[80%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 text-[0.95rem] leading-relaxed shadow-sm ${
            isUser
              ? 'rounded-2xl rounded-br-md bg-green text-paper'
              : isError
                ? 'rounded-2xl rounded-bl-md border border-clay/40 bg-clay-soft text-ink'
                : 'rounded-2xl rounded-bl-md border border-line bg-paper text-ink'
          }`}
        >
          {isUser ? (
            content.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                {line || ' '}
              </p>
            ))
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {highlightJenjo(content)}
            </ReactMarkdown>
          )}
        </div>
        {time && <span className="mt-1 px-1 text-[0.7rem] text-muted">{time}</span>}
      </div>
    </div>
  );
}
