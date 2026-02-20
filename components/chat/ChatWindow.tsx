"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorEmail: string;
};

const POLL_INTERVAL_MS = 2500;

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function fetchMessages(silent = false) {
    try {
      const res = await fetch(`/api/chat?_=${Date.now()}`, {
        cache: "no-store",
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages([]);
        return;
      }
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchMessages();
  }, []);

  useEffect(() => {
    const id = setInterval(() => fetchMessages(true), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Failed to send message");
        return;
      }

      setInput("");
      setMessages((prev) => [...prev, data]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-foreground">Chat</h1>
      <p className="mt-2 text-foreground-secondary">
        Global chat for all admitted members.
      </p>

      <div className="mt-6 flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background-secondary">
        <div className="flex min-h-[400px] max-h-[500px] flex-col">
          {loading ? (
            <p className="flex flex-1 items-center justify-center p-8 text-foreground-secondary">
              Loading...
            </p>
          ) : messages.length === 0 ? (
            <p className="flex flex-1 items-center justify-center p-8 text-foreground-secondary">
              No messages yet. Be the first to say hello!
            </p>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-border bg-background px-4 py-2"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-foreground">
                      {m.authorName}
                    </span>
                    <span className="text-xs text-foreground-secondary">
                      {formatTime(m.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-foreground-secondary whitespace-pre-wrap break-words">
                    {m.content}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t border-border p-4"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              maxLength={2000}
              className="flex-1"
              disabled={sending}
            />
            <Button type="submit" disabled={sending || !input.trim()}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
