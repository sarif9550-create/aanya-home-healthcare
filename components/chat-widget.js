'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function uuid(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16);});}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Aanya's AI care assistant. Ask me about any home healthcare service, pricing, or booking — I'm here 24/7." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scroller = useRef(null);

  useEffect(() => {
    let id = typeof window !== 'undefined' && localStorage.getItem('aanya_chat_session');
    if (!id) { id = uuid(); if (typeof window !== 'undefined') localStorage.setItem('aanya_chat_session', id); }
    setSessionId(id);
  }, []);

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(m => [...m, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: text }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.response || data.error || 'Sorry, something went wrong.' }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally { setLoading(false); }
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-24 right-5 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition" aria-label="Chat with AI">
          <Sparkles className="h-6 w-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[380px] h-[560px] max-h-[85vh] rounded-2xl border bg-card shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center"><Sparkles className="h-4 w-4" /></div>
              <div>
                <div className="font-semibold text-sm">Aanya AI Care Assistant</div>
                <div className="text-[11px] opacity-90">Powered by GPT · available 24/7</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded"><X className="h-5 w-5" /></button>
          </div>
          <div ref={scroller} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={m.role === 'user' ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%] text-sm' : 'bg-card border rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%] text-sm whitespace-pre-wrap'}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border rounded-2xl px-3 py-2 text-sm flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" />Thinking...</div>
              </div>
            )}
          </div>
          <div className="p-3 border-t bg-background flex gap-2">
            <Input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter')send();}} placeholder="Ask about a service, price, city..." disabled={loading} />
            <Button onClick={send} disabled={loading || !input.trim()} className="bg-gradient-to-r from-primary to-secondary"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
}
