"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type PendingItem = {
  id: string;
  name: string;
  classYear: number;
  email: string;
  phone: string;
  residence: string;
  occupation: string;
  submittedAt: Date;
  user: { id: string; email: string };
};

export function ApprovalsList({
  pending,
}: {
  pending: PendingItem[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleApprove(userId: string) {
    setLoading(userId);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function handleReject(userId: string) {
    setLoading(userId);
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (pending.length === 0) {
    return (
      <p className="mt-8 text-foreground-secondary">
        No pending approvals at this time.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {pending.map((item) => (
        <Card key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            <p className="text-sm text-foreground-secondary">
              Class of {item.classYear} • {item.occupation}
            </p>
            <p className="mt-1 text-sm text-foreground-secondary">
              {item.email} • {item.phone}
            </p>
            <p className="text-sm text-foreground-secondary">
              {item.residence}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleApprove(item.user.id)}
              disabled={loading !== null}
            >
              {loading === item.user.id ? "..." : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleReject(item.user.id)}
              disabled={loading !== null}
            >
              Reject
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
