"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { MemberCard } from "./MemberCard";

type Profile = {
  id: string;
  name: string;
  classYear: number;
  residence: string;
  occupation: string;
  bio: string | null;
  photoUrl: string | null;
  linkedinUrl: string | null;
  interests: string | null;
};

export function DirectoryContent() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [classYear, setClassYear] = useState("");
  const [residence, setResidence] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (classYear) params.set("classYear", classYear);
    if (residence) params.set("residence", residence);

    fetch(`/api/directory?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setProfiles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q, classYear, residence]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Member Directory</h1>
      <p className="mt-2 text-foreground-secondary">
        Search and browse member profiles.
      </p>

      <div className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Input
            placeholder="Search by name, class, occupation, interests..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="sm:max-w-xs"
          />
          <Input
            placeholder="Class year"
            type="number"
            value={classYear}
            onChange={(e) => setClassYear(e.target.value)}
            className="sm:max-w-[120px]"
          />
          <Input
            placeholder="Residence"
            value={residence}
            onChange={(e) => setResidence(e.target.value)}
            className="sm:max-w-xs"
          />
        </div>

        {loading ? (
          <p className="mt-8 text-foreground-secondary">Loading...</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <Link key={profile.id} href={`/directory/${profile.id}`}>
                <MemberCard profile={profile} />
              </Link>
            ))}
          </div>
        )}

        {!loading && profiles.length === 0 && (
          <p className="mt-8 text-foreground-secondary">
            No members found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
