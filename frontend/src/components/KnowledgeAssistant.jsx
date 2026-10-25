import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  User, 
  BookOpen, 
  Sparkles, 
  Loader2, 
  Check, 
  Copy,
  FileCode2
} from "lucide-react";
import { chatAssistantApi } from "../services/api";

const QUICK_PROMPTS = [
  "What is the standard concrete curing period according to ACI 308R?",
  "Explain OSHA 1926.451 guardrail and toeboard requirements for scaffolding.",
  "How is concrete slump interpreted under ASTM C143?",
  "What are the best drainage practices behind reinforced concrete retaining walls?"
];

export default function KnowledgeAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your AI Construction Intelligence & Engineering Code Specialist. You can ask me technical questions regarding civil engineering, building codes (IBC, ACI, Eurocode, IS), OSHA safety standards, structural forensics, or project management best practices.",
      codes: ["IBC 2024", "ACI 318-19", "OSHA 1926", "ASTM Standards"],
      followups: [
        "What is the standard concrete curing period according to ACI 308R?",
        "Explain OSHA scaffolding guardrail requirements."
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("Civil Engineering Standards");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Build conversation history for API
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const response = await chatAssistantApi(text, topic, history);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: response.reply,
          codes: response.reference_codes,
          followups: response.suggested_followups
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `Apologies, I encountered an error: ${err.message}. Please verify the backend connection.`,
          codes: [],
          followups: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-6 h-6 text-amber-500" />
              Construction Knowledge Assistant & Engineering Copilot
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Context-aware assistant for structural codes, OSHA safety regulations, ASTM material specifications, and site troubleshooting.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
              Technical RAG & Codes
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Quick Prompts & Topic Filter */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Engineering Topic Domain
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
              >
                <option>Civil Engineering Standards & Codes</option>
                <option>OSHA Construction Safety Regulations</option>
                <option>Concrete Mix & Materials Technology</option>
                <option>Structural Dynamics & Defect Remediation</option>
                <option>MEP & HVAC System Commissioning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                Frequently Referenced Queries
              </label>
              <div className="space-y-2">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-left text-xs text-slate-700 transition-all font-medium leading-snug"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="lg:col-span-8 flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map((m, idx) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs ${
                    isAssistant ? "justify-start" : "justify-end"
                  }`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm space-y-2.5 leading-relaxed ${
                      isAssistant
                        ? "bg-white border border-slate-200 text-slate-800"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[11px] opacity-75">
                        {isAssistant ? "AI Knowledge Specialist" : "You"}
                      </span>
                      {isAssistant && (
                        <button
                          onClick={() => handleCopy(m.content, idx)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          title="Copy answer"
                        >
                          {copiedIdx === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    <p className="whitespace-pre-line text-xs">{m.content}</p>

                    {/* Reference Codes */}
                    {isAssistant && m.codes && m.codes.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <FileCode2 className="w-3 h-3 text-amber-500" /> References:
                        </span>
                        {m.codes.map((code, cIdx) => (
                          <span
                            key={cIdx}
                            className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Suggested followups */}
                    {isAssistant && m.followups && m.followups.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          Suggested Technical Inquiries:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.followups.map((f, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => handleSend(f)}
                              className="text-[11px] bg-amber-50/70 hover:bg-amber-100 text-amber-900 px-2 py-1 rounded-md border border-amber-200 transition-colors text-left"
                            >
                              → {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold shrink-0 shadow-sm mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 text-xs justify-start">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>Searching engineering standards & code databases...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about building codes, concrete specs, OSHA rules, or structural issues..."
                className="flex-1 text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
