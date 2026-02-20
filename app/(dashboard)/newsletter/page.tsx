import { ProfileGuard } from "@/components/ProfileGuard";
import { NewsletterContent } from "@/components/newsletter/NewsletterContent";

export default function NewsletterPage() {
  return (
    <ProfileGuard>
      <NewsletterContent />
    </ProfileGuard>
  );
}
