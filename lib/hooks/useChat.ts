"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import type { Activity } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseChatOptions {
  activities: Activity[];
}

export function useChat({ activities }: UseChatOptions) {
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

  const sendMessage = useCallback(async (message: string) => {
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
  }, [activities, isLoading]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    messagesEndRef,
    inputRef,
    sendMessage,
    handleSubmit,
  };
}