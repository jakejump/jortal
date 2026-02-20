import { prisma } from "@/lib/prisma";
import { ApprovalsList } from "./ApprovalsList";

export default async function ApprovalsPage() {
  const pending = await prisma.pendingApproval.findMany({
    include: {
      user: {
        select: { id: true, email: true, createdAt: true },
      },
    },
    orderBy: { submittedAt: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Pending Approvals</h1>
      <p className="mt-2 text-foreground-secondary">
        Review and approve or reject new member applications.
      </p>

      <ApprovalsList pending={pending} />
    </div>
  );
}
