import React, { useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const STORE_CONTEXT = `You are DeshiBazar AI assistant for a Bangladeshi 10-minute delivery ecommerce.
Products include electronics, fashion, gadgets, accessories. Delivery promise: 10 minutes in service zones around Dhaka.
Key features: live order tracking with rider location, rider dashboard, admin management.
Payment: Cash on delivery (online coming soon).`;

export const ChatWidget: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'sys', role: 'system', content: STORE_CONTEXT }
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `m-${Date.now()}`, role: 'user', content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const body = {
        contents: [
          ...messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: userMsg.content }] }
        ],
        systemInstruction: { role: 'user', parts: [{ text: STORE_CONTEXT }] }
      };
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: text }]);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    } catch (e) {
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: 'Error connecting to AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button onClick={() => setOpen(true)} className="rounded-full bg-black text-white p-3 shadow-lg hover:opacity-90">
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="font-semibold">DeshiBazar Assistant</div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-2">
            {messages.filter(m => m.role !== 'system').map((m) => (
              <div key={m.id} className={`text-sm ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-3 py-2 rounded-2xl ${m.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex items-center gap-2">
            <input
              className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, delivery..."
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            />
            <button onClick={send} disabled={loading} className="p-2 rounded-full bg-black text-white disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;


