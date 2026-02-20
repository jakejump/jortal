import { ProfileGuard } from "@/components/ProfileGuard";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <ProfileGuard>
      <ChatWindow />
    </ProfileGuard>
  );
}
