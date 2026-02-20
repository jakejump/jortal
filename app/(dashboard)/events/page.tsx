import { ProfileGuard } from "@/components/ProfileGuard";
import { EventsContent } from "@/components/events/EventsContent";

export default function EventsPage() {
  return (
    <ProfileGuard>
      <EventsContent />
    </ProfileGuard>
  );
}
