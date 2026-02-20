import { ProfileGuard } from "@/components/ProfileGuard";
import { DirectoryContent } from "@/components/directory/DirectoryContent";

export default function DirectoryPage() {
  return (
    <ProfileGuard>
      <DirectoryContent />
    </ProfileGuard>
  );
}
