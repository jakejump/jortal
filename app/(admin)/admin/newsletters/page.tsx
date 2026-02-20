"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Newsletter = {
  id: string;
  title: string;
  fileUrl: string;
  publishedAt: string;
};

export default function AdminNewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function fetchNewsletters() {
    try {
      const res = await fetch("/api/newsletters", { cache: "no-store", credentials: "include" });
      const data = await res.json();
      setNewsletters(Array.isArray(data) ? data : []);
    } catch {
      setNewsletters([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNewsletters();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);
      formData.append("date", date);

      const res = await fetch("/api/admin/newsletters", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        setTitle("");
        setFile(null);
        setDate(new Date().toISOString().slice(0, 10));
        await fetchNewsletters();
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this newsletter?")) return;
    const res = await fetch(`/api/admin/newsletters/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setNewsletters((prev) => prev.filter((n) => n.id !== id));
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Newsletters</h1>
      <p className="mt-2 text-foreground-secondary">
        Upload PDF newsletters to the archive.
      </p>

      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Spring 2024 Newsletter"
            required
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-foreground-secondary">
              PDF File
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 text-sm text-foreground-secondary"
              required
            />
          </div>
          <Button type="submit" disabled={uploading || !file}>
            {uploading ? "Uploading..." : "Upload Newsletter"}
          </Button>
        </form>
      </Card>

      <h2 className="mt-12 text-xl font-semibold text-foreground">
        Uploaded Newsletters
      </h2>
      {loading ? (
        <p className="mt-4 text-foreground-secondary">Loading...</p>
      ) : (
        <div className="mt-4 space-y-4">
          {newsletters.map((n) => (
            <Card key={n.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">{n.title}</h3>
                <p className="text-sm text-foreground-secondary">
                  {formatDate(n.publishedAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={n.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  View
                </a>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(n.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
