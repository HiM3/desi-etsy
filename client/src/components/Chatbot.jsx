import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRobot, FaPaperPlane, FaComments, FaSpinner } from 'react-icons/fa';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, aiLoading]);

  const fetchHistory = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.data || []);
    } catch (err) {
      setMessages([]);
      setError('Failed to load chat history.');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || aiLoading) return;
    setError(null);
    const userMsg = { sender: 'user', text: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/message`,
        { text: userMsg.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
          const aiMsg = res.data.aiMessage
        ? { sender: 'ai', text: res.data.aiMessage, timestamp: new Date().toISOString() }
        : { sender: 'ai', text: 'Sorry, something went wrong.', timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, something went wrong.', timestamp: new Date().toISOString() }
      ]);
      setError('Failed to get AI response.');
    }
    setAiLoading(false);
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-[#d35400] text-white p-4 rounded-full shadow-lg hover:bg-[#b34700] transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Chatbot"
      >
        <FaComments size={24} />
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-full bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200">
          <div className="flex items-center px-4 py-3 border-b font-bold text-[#d35400]">
            <FaRobot className="mr-2" /> AI Chatbot
            <button className="ml-auto text-gray-400 hover:text-[#d35400] text-2xl leading-none" onClick={() => setOpen(false)} aria-label="Close Chatbot">&times;</button>
          </div>
          <div className="flex-1 bg-white overflow-y-auto px-4 py-2" style={{ maxHeight: 350, minHeight: 200 }}>
            {messages.length === 0 && !aiLoading && (
              <div className="text-center text-gray-400 mt-8">
                <div className="mb-2">👋 Hi! I'm your AI assistant. How can I help you today?</div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`my-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] relative shadow ${msg.sender === 'user' ? 'bg-[#d35400] text-white' : 'bg-gray-100 text-gray-800'}`}
                  tabIndex={0} aria-label={msg.sender === 'user' ? 'You' : 'AI'}>
                  {msg.text}
                  <span className="block text-[10px] text-right text-gray-400 mt-1">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="my-2 flex justify-start">
                <div className="px-3 py-2 rounded-lg text-sm max-w-[80%] bg-gray-100 text-gray-800 flex items-center gap-2">
                  <FaSpinner className="animate-spin" /> AI is typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex border-t p-2 bg-white">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-[#d35400] focus:border-[#d35400] text-sm bg-white"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={aiLoading}
              aria-label="Type your message"
              autoFocus={open}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !aiLoading) sendMessage(e); }}
            />
            <button
              type="submit"
              className="ml-2 px-3 py-2 bg-[#d35400] text-white rounded-lg hover:bg-[#b34700] transition-colors disabled:opacity-50"
              disabled={aiLoading || !input.trim()}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
          {error && <div className="text-xs text-red-500 px-4 pb-2">{error}</div>}
        </div>
      )}
    </>
  );
};

export default Chatbot;
