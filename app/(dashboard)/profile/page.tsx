"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const required = searchParams.get("required") === "1";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    classYear: "",
    residence: "",
    occupation: "",
    phone: "",
    bio: "",
    linkedinUrl: "",
    interests: "",
    twitter: "",
    instagram: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setLoading(false);
          return;
        }
        if (data.name) {
          setForm({
            name: data.name,
            classYear: String(data.classYear),
            residence: data.residence,
            occupation: data.occupation,
            phone: data.phone ?? "",
            bio: data.bio ?? "",
            linkedinUrl: data.linkedinUrl ?? "",
            interests: data.interests ?? "",
            twitter: (data.socialLinks as { twitter?: string })?.twitter ?? "",
            instagram: (data.socialLinks as { instagram?: string })?.instagram ?? "",
          });
          setPhotoUrl(data.photoUrl);
        }
        setLoading(false);
      });
  }, []);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch("/api/profile/photo", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.photoUrl) {
      setPhotoUrl(data.photoUrl);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          classYear: parseInt(form.classYear, 10),
          residence: form.residence,
          occupation: form.occupation,
          phone: form.phone || undefined,
          bio: form.bio || undefined,
          linkedinUrl: form.linkedinUrl || undefined,
          interests: form.interests || undefined,
          socialLinks: {
            twitter: form.twitter || undefined,
            instagram: form.instagram || undefined,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setSaving(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-foreground-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Profile</h1>
      <p className="mt-2 text-foreground-secondary">
        {required
          ? "Complete your profile to access the full portal."
          : "Update your profile information."}
      </p>

      {required && (
        <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-foreground-secondary">
          Please complete your profile to access the directory, events, and
          newsletter.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8">
        <Card className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div>
              <label className="block text-sm font-medium text-foreground-secondary">
                Profile Photo
              </label>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border bg-background">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-foreground-secondary">
                      No photo
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="text-sm text-foreground-secondary"
                />
              </div>
            </div>
          </div>

          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Class Year"
            type="number"
            value={form.classYear}
            onChange={(e) => setForm({ ...form, classYear: e.target.value })}
            required
            min={1900}
            max={2100}
          />
          <Input
            label="Place of Residence"
            value={form.residence}
            onChange={(e) => setForm({ ...form, residence: e.target.value })}
            required
          />
          <Input
            label="Occupation"
            value={form.occupation}
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
          <div>
            <label className="block text-sm font-medium text-foreground-secondary">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-lg border border-border bg-background-secondary px-4 py-2 text-foreground placeholder:text-foreground-secondary/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Tell us about yourself..."
            />
          </div>
          <Input
            label="LinkedIn URL"
            type="url"
            value={form.linkedinUrl}
            onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
          <Input
            label="Interests"
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
            placeholder="e.g. Hiking, Photography, Technology"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Twitter"
              value={form.twitter}
              onChange={(e) => setForm({ ...form, twitter: e.target.value })}
              placeholder="@username"
            />
            <Input
              label="Instagram"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="@username"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </Card>
      </form>
    </div>
  );
}
