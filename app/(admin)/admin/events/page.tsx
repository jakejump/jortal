"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Event = {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  location: string | null;
};

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
  });

  async function fetchEvents(silent = false) {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/events?all=true", { cache: "no-store", credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        console.error("Events fetch error:", data);
        setEvents([]);
        return;
      }
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Events fetch error:", err);
      setEvents([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchEvents(true);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          eventDate: form.eventDate,
          location: form.location || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ title: "", description: "", eventDate: "", location: "" });
        setShowForm(false);
        router.refresh();
        await fetchEvents();
      } else {
        alert(data?.error ?? "Failed to create event");
      }
    } catch (err) {
      console.error("Create event error:", err);
      alert("Failed to create event");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Events</h1>
      <p className="mt-2 text-foreground-secondary">
        Create and manage upcoming events.
      </p>

      <Button
        className="mt-6"
        onClick={() => setShowForm(!showForm)}
        variant={showForm ? "secondary" : "primary"}
      >
        {showForm ? "Cancel" : "Create Event"}
      </Button>

      {showForm && (
        <Card className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-foreground-secondary">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-background-secondary px-4 py-2 text-foreground"
              />
            </div>
            <Input
              label="Date & Time"
              type="datetime-local"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </Card>
      )}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-foreground-secondary">Loading...</p>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{event.title}</h3>
                <p className="text-sm text-foreground-secondary">
                  {formatDate(event.eventDate)}
                  {event.location && ` • ${event.location}`}
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(event.id)}
              >
                Delete
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
