"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";

type Event = {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  location: string | null;
};

export function EventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEvents(silent = false) {
    try {
      const res = await fetch(`/api/events?_=${Date.now()}`, {
        cache: "no-store",
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (!res.ok) {
        setEvents([]);
        return;
      }
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchEvents(true);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Upcoming Events</h1>
      <p className="mt-2 text-foreground-secondary">
        View upcoming society events.
      </p>

      {loading ? (
        <p className="mt-8 text-foreground-secondary">Loading...</p>
      ) : events.length === 0 ? (
        <p className="mt-8 text-foreground-secondary">
          No upcoming events at this time.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {events.map((event) => (
            <Card key={event.id}>
              <h3 className="text-lg font-semibold text-foreground">
                {event.title}
              </h3>
              <p className="mt-1 text-sm text-foreground-secondary">
                {formatDate(event.eventDate)}
              </p>
              {event.location && (
                <p className="text-sm text-foreground-secondary">
                  {event.location}
                </p>
              )}
              {event.description && (
                <p className="mt-2 text-foreground">{event.description}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
