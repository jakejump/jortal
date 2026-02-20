import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "./SignOutButton";

export default async function PendingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "pending") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-foreground">
        Awaiting Approval
      </h1>
      <p className="mt-4 text-foreground-secondary">
        Your application has been submitted. An administrator will review your
        account and approve it shortly. You will be able to access the full
        portal once approved.
      </p>
      <div className="mt-8">
        <SignOutButton />
      </div>
    </div>
  );
}
