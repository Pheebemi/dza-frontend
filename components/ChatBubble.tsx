interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div
      className={`animate-rise mb-4 flex items-start gap-2.5 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <span className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-green font-display text-sm font-bold text-ochre">
          P
        </span>
      )}

      <div
        className={`max-w-[80%] px-4 py-3 text-[0.95rem] leading-relaxed shadow-sm ${
          isUser
            ? 'rounded-2xl rounded-br-md bg-green text-paper'
            : 'rounded-2xl rounded-bl-md border border-line bg-paper text-ink'
        }`}
      >
        {content.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
            {line || ' '}
          </p>
        ))}
      </div>
    </div>
  );
}
