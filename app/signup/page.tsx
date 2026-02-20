"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          classYear: parseInt(formData.get("classYear") as string, 10),
          email: formData.get("email"),
          phone: formData.get("phone"),
          residence: formData.get("residence"),
          occupation: formData.get("occupation"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/api/auth/signin?callbackUrl=/");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground">Sign Up</h1>
      <p className="mt-2 text-foreground-secondary">
        Create an account. An admin will review your application.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="Full Name"
          name="name"
          type="text"
          required
          placeholder="John Doe"
        />
        <Input
          label="Class Year"
          name="classYear"
          type="number"
          required
          placeholder="2024"
          min={1900}
          max={2100}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          required
          placeholder="+1 234 567 8900"
        />
        <Input
          label="Place of Residence"
          name="residence"
          type="text"
          required
          placeholder="New York, NY"
        />
        <Input
          label="Occupation"
          name="occupation"
          type="text"
          required
          placeholder="Software Engineer"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          minLength={6}
        />

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Sign Up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground-secondary">
        Already have an account?{" "}
        <Link href="/signin" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
