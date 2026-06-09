"use client";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Bot, Send, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "What's my biggest source of emissions?",
  "How can I reduce my carbon footprint?",
  "Break down my transport emissions",
  "What does my food consumption look like?",
  "Am I on track with my daily budget?",
];

export default function AssistantPage() {
  const { activities } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I'm your AI Climate Assistant. I can answer questions about your logged activities and help you understand your carbon footprint. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: activities }),
      });
      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "Sorry, I couldn't process that request.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered an error. Please check your API key or try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-[40px] font-medium text-ink tracking-[-1.0px] mb-2 flex items-center gap-3">
              AI Climate Assistant
            </h1>
            <p className="text-muted font-medium">
              Ask anything about your carbon footprint. Get answers grounded in
              your real data.
            </p>
          </header>

          {activities.length === 0 && (
            <div className="mb-8 p-4 rounded-xl bg-brand-peach/20 border border-brand-peach/30 text-ink font-medium text-[14px]">
              Log some activities first to get personalized answers about your
              carbon footprint.
            </div>
          )}

          {messages.length <= 1 && activities.length > 0 && (
            <div className="mb-8">
              <p className="text-[13px] font-bold text-muted uppercase tracking-wider mb-3">
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="px-4 py-2 rounded-xl bg-surface-soft border border-hairline text-[14px] font-semibold text-ink hover:bg-hairline transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-brand-teal text-white"
                      : "bg-ink text-white"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <User className="w-5 h-5" aria-hidden="true" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                    msg.role === "assistant"
                      ? "bg-surface-soft border border-hairline text-ink"
                      : "bg-brand-teal text-white"
                  }`}
                >
                  <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="bg-surface-soft border border-hairline rounded-2xl px-5 py-3">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2 h-2 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="border-t border-hairline bg-surface-soft p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your carbon footprint..."
            disabled={isLoading}
            className="flex-1 px-5 py-3.5 rounded-xl bg-canvas border border-hairline text-body text-[15px] font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-shadow disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3.5 rounded-xl bg-brand-teal text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
