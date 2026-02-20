import Image from "next/image";
import { Card } from "@/components/ui/Card";

type Profile = {
  name: string;
  classYear: number;
  residence: string;
  occupation: string;
  bio: string | null;
  photoUrl: string | null;
};

export function MemberCard({ profile }: { profile: Profile }) {
  const bioPreview = profile.bio
    ? profile.bio.length > 120
      ? profile.bio.slice(0, 120) + "..."
      : profile.bio
    : null;

  return (
    <Card className="h-full transition-colors hover:border-accent/50">
      <div className="flex gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-background">
          {profile.photoUrl ? (
            <Image
              src={profile.photoUrl}
              alt={profile.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-foreground-secondary">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">{profile.name}</h3>
          <p className="text-sm text-foreground-secondary">
            Class of {profile.classYear}
          </p>
          <p className="text-sm text-foreground-secondary">
            {profile.occupation}
          </p>
          {bioPreview && (
            <p className="mt-2 line-clamp-2 text-sm text-foreground-secondary">
              {bioPreview}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
