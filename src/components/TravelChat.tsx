import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, X, Send, Sparkles, Compass, ShieldAlert, Heart, RefreshCw, Settings, Database, ExternalLink, HelpCircle, FileText, Check, AlertCircle, Phone, Trash2 } from 'lucide-react';

interface TravelChatProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  apiHealth: 'online' | 'offline' | 'checking';
  setApiHealth: (status: 'online' | 'offline' | 'checking') => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  onRefreshHealth: () => void;
}

export default function TravelChat({
  isOpen,
  setIsOpen,
  sessionId,
  setSessionId,
  apiHealth,
  setApiHealth,
  apiUrl,
  setApiUrl,
  onRefreshHealth
}: TravelChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi there! 👋 I am **TripBot**, your live AI Travel Companion. I can help you outline itineraries, plan packing bags, or calculate budgets!\n\nWhere are you heading today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Contact prompt states
  const [shouldPromptPhone, setShouldPromptPhone] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // conversation_ended state
  const [conversationEnded, setConversationEnded] = useState(false);
  
  // Actions loading states
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Count user messages to automatically prompt for email and phone after 4 messages
  const userMsgCount = messages.filter(m => m.sender === 'user').length;
  const shouldShowContactPrompt = shouldPromptPhone || userMsgCount >= 4;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, shouldShowContactPrompt]);

  // Synchronize history automatically on first open or when session ID changes
  useEffect(() => {
    if (isOpen && sessionId) {
      syncHistory();
    }
  }, [isOpen, sessionId]);

  // Sync conversation history from Replit server
  const syncHistory = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`${apiUrl}/api/chat/history/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.messages)) {
          const mappedMessages: ChatMessage[] = data.messages.map((msg: any, idx: number) => ({
            id: `history-${idx}-${Date.now()}`,
            sender: msg.role === 'user' ? 'user' : 'assistant',
            text: msg.content,
            timestamp: new Date()
          }));
          
          if (mappedMessages.length > 0) {
            setMessages(mappedMessages);
          } else {
            // Default welcome message if empty on server
            setMessages([
              {
                id: 'welcome',
                sender: 'assistant',
                text: `Hi there! 👋 I am **TripBot** (Session: **${sessionId}**). I'm connected to the Replit API and ready to outline itineraries, plan packing bags, or calculate budgets!\n\nWhere are you heading today?`,
                timestamp: new Date()
              }
            ]);
          }
        }
      } else {
        throw new Error(`Failed with status: ${res.status}`);
      }
    } catch (err) {
      console.error("Failed to sync history:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Clear session history on Replit server
  const clearHistory = async () => {
    setIsClearing(true);
    try {
      const res = await fetch(`${apiUrl}/api/chat/history/${sessionId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessages([
          {
            id: `welcome-${Date.now()}`,
            sender: 'assistant',
            text: `Session **${sessionId}** has been successfully cleared on the Replit server. The history was wiped clean.\n\nHow can I help you plan your next journey?`,
            timestamp: new Date()
          }
        ]);
        setShouldPromptPhone(false);
        setContactSubmitted(false);
        setContactEmail('');
        setContactPhone('');
        setConversationEnded(false);
      } else {
        throw new Error(`Failed to clear session on server: status ${res.status}`);
      }
    } catch (err) {
      console.error("Failed to clear session:", err);
    } finally {
      setIsClearing(false);
    }
  };

  // Clickable suggested prompts to help users test the chat easily
  const quickPrompts = [
    { label: '🇮🇳 Jaipur 3-Day Plan', text: 'Can you outline a perfect 3-day itinerary for Jaipur, India?' },
    { label: '🏖️ Goa Budget Tips', text: 'What are some great tips to optimize a budget trip to Goa?' },
    { label: '🌸 Japan Itinerary', text: 'Can you suggest a 5-day cherry blossom season itinerary in Japan?' },
    { label: '💶 Paris Budget Tips', text: 'How should I optimize my budget for an elegant 3-day Paris trip?' }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    // Append user's message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const systemInstruction = "\n\n(System Note for AI: The user requests professional, clear English only. Please reply strictly in English. Do not mix any Hindi or Hinglish words.)";

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: textToSend.trim() + systemInstruction
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        let apiErrorMsg = "Failed to get a response from the AI. Please try again.";
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error) apiErrorMsg = parsed.error;
        } catch {
          // ignore parsing error, use fallback
        }
        throw new Error(apiErrorMsg);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.response || "No response received.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle custom prompt_phone flag from OpenAPI schema
      if (data.prompt_phone) {
        setShouldPromptPhone(true);
      }

      // Handle custom conversation_ended flag from OpenAPI schema
      if (data.conversation_ended) {
        setConversationEnded(true);
      }

    } catch (error: any) {
      console.error("API Chat Error:", error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **API Response Status 500:**\n${error.message || "Something went wrong."}\n\n*Note: The Replit AI server might be experiencing transient issues with its upstream AI provider.*`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Convert custom basic markdown to HTML for mock responses (bullet points, bold text, headers)
  const formatMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('### ')) {
        return <h4 key={idx} className="font-display font-bold text-sm text-slate-900 mt-3 mb-1.5">{trimmed.replace('### ', '')}</h4>;
      }
      if (trimmed.startsWith('#### ')) {
        return <h5 key={idx} className="font-display font-bold text-xs text-brand-700 mt-2.5 mb-1">{trimmed.replace('#### ', '')}</h5>;
      }
      
      // Bullet points
      if (trimmed.startsWith('* ')) {
        const itemText = trimmed.replace('* ', '');
        return (
          <li key={idx} className="ml-3 list-disc text-[11px] text-slate-600 mb-1 leading-relaxed">
            {formatInlineBold(itemText)}
          </li>
        );
      }
      
      // Numbered lists
      if (/^\d+\.\s/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s/, '');
        const num = trimmed.match(/^\d+/)?.[0] || '';
        return (
          <div key={idx} className="flex gap-1.5 ml-2 text-[11px] text-slate-600 mb-1.5 leading-relaxed">
            <span className="font-bold text-brand-600">{num}.</span>
            <span>{formatInlineBold(itemText)}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-[11px] text-slate-600 mb-2 leading-relaxed">
          {formatInlineBold(line)}
        </p>
      );
    });
  };

  const formatInlineBold = (text: string) => {
    // Regex for bold text **like this** and inline code `like this`
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1 py-0.5 bg-slate-100 rounded font-mono text-[9px] text-rose-600 font-semibold">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Collapsed Float Badge (Bottom-Right) */}
      <button
        id="floating-chat-trigger"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-brand-600 hover:bg-brand-700 text-white rounded-full p-4 shadow-xl shadow-brand-500/20 transition-all hover:scale-110 active:scale-95 cursor-pointer group flex items-center gap-2 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out text-xs font-bold whitespace-nowrap pl-0 group-hover:pl-1">
          Travel Assistant
        </span>
      </button>

      {/* Expandable Chat Drawer */}
      <div
        id="travel-chat-drawer"
        className={`fixed bottom-6 right-6 z-50 w-[350px] sm:w-[390px] h-[550px] bg-white rounded-[2rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'
        }`}
      >
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 rounded-full bg-brand-500 items-center justify-center font-bold text-sm text-white shadow-inner">
              🤖
              <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-slate-900 ${
                apiHealth === 'online' ? 'bg-emerald-400' : apiHealth === 'checking' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xs">TripBot</span>
                <span className="bg-brand-500/20 text-brand-300 text-[8px] px-1.5 py-0.2 rounded font-mono uppercase tracking-wide">Replit API</span>
              </div>
              <p className="text-[10px] text-slate-400">Session: {sessionId}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              id="chat-toggle-settings"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showSettings ? 'text-brand-500 bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="API & Session Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              id="close-chat-drawer"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* API Integration Notice banner */}
        <div className="bg-indigo-50 border-b border-indigo-100 px-3 py-1.5 text-center flex items-center justify-between gap-1.5 text-[10px] text-indigo-800 font-medium shrink-0">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
            <span>Fully Connected to Replit AI Backend</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={syncHistory}
              disabled={isSyncing}
              className="text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider text-[9px] cursor-pointer disabled:opacity-50"
            >
              {isSyncing ? "Syncing..." : "Sync"}
            </button>
            <span className="text-indigo-200">|</span>
            <button
              onClick={clearHistory}
              disabled={isClearing}
              className="text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider text-[9px] cursor-pointer disabled:opacity-50"
            >
              {isClearing ? "Clear" : "Reset"}
            </button>
          </div>
        </div>

        {/* Main Body: Settings panel vs Message thread */}
        {showSettings ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-slate-800">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Connection Health</h4>
              <div className="bg-white px-3 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    apiHealth === 'online' ? 'bg-emerald-500 animate-pulse' : apiHealth === 'checking' ? 'bg-amber-400 animate-spin' : 'bg-rose-500'
                  }`} />
                  <span className="text-xs font-bold text-slate-700">
                    {apiHealth === 'online' ? 'Connected (Live)' : apiHealth === 'checking' ? 'Pinging...' : 'Offline / Error'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onRefreshHealth}
                  className="text-slate-400 hover:text-brand-600 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Check Connection"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Configure Session ID</h4>
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="e.g. my-user-1"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-semibold bg-slate-50"
                />
                <p className="text-[10px] text-slate-400 leading-normal">
                  Matches your Replit session ID. Standard curl logs persist context across chats with the same ID.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={syncHistory}
                    disabled={isSyncing}
                    className="flex-1 bg-brand-50 hover:bg-brand-100 disabled:bg-slate-50 text-brand-700 disabled:text-slate-400 border border-brand-100 hover:border-brand-200 text-[10px] font-bold py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sync history</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearHistory}
                    disabled={isClearing}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-50 text-rose-700 disabled:text-slate-400 border border-rose-100 hover:border-rose-200 text-[10px] font-bold py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear logs</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Interactive Docs References</h4>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs text-xs">
                <a
                  href={`${apiUrl}/api/docs/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 hover:bg-slate-50 transition-colors group"
                >
                  <span className="font-semibold text-slate-600 group-hover:text-brand-600">Swagger Interactive Docs</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <a
                  href={`${apiUrl}/api/help/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 hover:bg-slate-50 transition-colors group"
                >
                  <span className="font-semibold text-slate-600 group-hover:text-brand-600">Static API Guide</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              Back to Chat
            </button>
          </div>
        ) : (
          /* Message Area */
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-medium shadow-xs border ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white border-brand-600 rounded-tr-none'
                      : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div>{formatMarkdown(msg.text)}</div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-1 font-medium px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Custom Interactive Contact info form (Email + Phone number) */}
            {shouldShowContactPrompt && (
              <div className="bg-gradient-to-br from-indigo-50 to-brand-50 border border-indigo-150 rounded-2xl p-4 space-y-3.5 shadow-xs max-w-[90%] mr-auto text-left">
                <div className="flex items-start gap-2 text-indigo-900">
                  <Phone className="w-4.5 h-4.5 text-brand-600 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h5 className="font-display font-black text-xs">Connect with a Travel Expert?</h5>
                    <p className="text-[11px] text-indigo-700 leading-normal mt-1 font-medium">
                      TripBot noticed you are planning an incredible journey! Please share your contact info so a live expert advisor can email and call you with discounted flight, lodging, and local itinerary quotes.
                    </p>
                  </div>
                </div>
                {contactSubmitted ? (
                  <div className="bg-emerald-500/10 text-emerald-800 text-[10px] font-bold p-2.5 rounded-xl border border-emerald-200">
                    ✓ Thank you! A travel expert will email you at <strong>{contactEmail}</strong> and call you at <strong>{contactPhone}</strong> shortly.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold text-slate-800"
                    />
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        placeholder="Enter your phone number..."
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold text-slate-800"
                      />
                      <button
                        onClick={() => {
                          if (contactEmail.trim() && contactPhone.trim()) setContactSubmitted(true);
                        }}
                        className="bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-black px-4 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conversation ended alert from Replit Server */}
            {conversationEnded && (
              <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-2xl max-w-[90%] mx-auto text-center space-y-1">
                <AlertCircle className="w-5 h-5 text-slate-500 mx-auto" />
                <h5 className="text-xs font-bold text-slate-800">Trip Planning Completed</h5>
                <p className="text-[10px] text-slate-500 leading-normal font-medium">
                  TripBot has naturally concluded this itinerary session. Bon Voyage!
                </p>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start max-w-[85%] mr-auto">
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-100 text-slate-600 flex items-center gap-2 rounded-tl-none shadow-xs">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Querying Replit API...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Prompts Drawer Footer (Suggestion chips) */}
        {messages.length === 1 && !isTyping && !showSettings && (
          <div className="px-4 py-2 border-t border-slate-100 bg-white shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Try asking:</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {quickPrompts.map((p, idx) => (
                <button
                  id={`prompt-chip-${idx}`}
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  className="bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-100 text-slate-600 hover:text-brand-700 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input form */}
        {!showSettings && (
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center shrink-0">
            <input
              id="chat-message-text-input"
              type="text"
              placeholder={conversationEnded ? "Session completed..." : "Ask TripBot..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping || conversationEnded}
              className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-semibold bg-slate-50/50 disabled:opacity-55 placeholder:text-slate-400 text-slate-800"
            />
            <button
              id="chat-send-btn"
              type="submit"
              disabled={!inputValue.trim() || isTyping || conversationEnded}
              className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </>
  );
}
