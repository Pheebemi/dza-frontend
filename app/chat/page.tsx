'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Navbar from '@/components/Navbar';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import { sendMessage, Message } from '@/lib/api';

const WELCOME: Message = {
  role: 'assistant',
  content:
    "Səko! I'm Mwambwi, your Jenjo language tutor.\n\nAsk me anything in English and I'll teach you how to say it in Jenjo, or type Jenjo and I'll explain it!",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    const history = messages.filter((m) => m !== WELCOME);
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await sendMessage(text, history);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please check the backend is running.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto' }} className="chat-scroll">
        <Box sx={{ maxWidth: 672, mx: 'auto', px: 2, py: 2 }}>
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'primary.main',
                  width: 32,
                  height: 32,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                M
              </Avatar>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <span className="w-2 h-2 bg-[#1B5E20] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#1B5E20] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#1B5E20] rounded-full animate-bounce [animation-delay:300ms]" />
              </Box>
            </Box>
          )}
          <div ref={bottomRef} />
        </Box>
      </Box>

      {/* Input */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ maxWidth: 672, mx: 'auto' }}>
          <ChatInput onSend={handleSend} disabled={loading} />
        </Box>
      </Box>
    </Box>
  );
}
