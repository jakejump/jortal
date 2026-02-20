"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

type Newsletter = {
  id: string;
  title: string;
  fileUrl: string;
  publishedAt: string;
};

export function NewsletterContent() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newsletters", { cache: "no-store", credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setNewsletters(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Newsletter Archive</h1>
      <p className="mt-2 text-foreground-secondary">
        Browse all newsletters going back.
      </p>

      {loading ? (
        <p className="mt-8 text-foreground-secondary">Loading...</p>
      ) : newsletters.length === 0 ? (
        <p className="mt-8 text-foreground-secondary">
          No newsletters yet.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {newsletters.map((newsletter) => (
            <Card key={newsletter.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {newsletter.title}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/newsletter/${newsletter.id}`}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent/90"
                  >
                    View
                  </Link>
                  <a
                    href={newsletter.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-border"
                  >
                    Download
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
