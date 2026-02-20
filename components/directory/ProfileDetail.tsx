import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

type Profile = {
  name: string;
  classYear: number;
  residence: string;
  occupation: string;
  bio: string | null;
  photoUrl: string | null;
  linkedinUrl: string | null;
  interests: string | null;
  socialLinks: unknown;
};

export function ProfileDetail({
  profile,
  email,
  phone,
}: {
  profile: Profile;
  email: string;
  phone: string | null;
}) {
  const raw = profile.socialLinks;
  const social =
    typeof raw === "string"
      ? (JSON.parse(raw || "{}") as { twitter?: string; instagram?: string })
      : (raw as { twitter?: string; instagram?: string } | null);

  return (
    <div>
      <Link
        href="/directory"
        className="text-sm text-foreground-secondary hover:text-accent"
      >
        ← Back to Directory
      </Link>

      <Card className="mt-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border border-border bg-background">
            {profile.photoUrl ? (
              <Image
                src={profile.photoUrl}
                alt={profile.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-foreground-secondary">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {profile.name}
            </h1>
            <p className="text-foreground-secondary">
              Class of {profile.classYear}
            </p>
            <p className="text-foreground-secondary">{profile.occupation}</p>
            <p className="text-foreground-secondary">{profile.residence}</p>
            <p className="text-foreground-secondary">
              <a href={`mailto:${email}`} className="hover:text-accent hover:underline">
                {email}
              </a>
            </p>
            {phone && (
              <p className="text-foreground-secondary">
                <a href={`tel:${phone}`} className="hover:text-accent hover:underline">
                  {phone}
                </a>
              </p>
            )}

            {profile.bio && (
              <div className="mt-4">
                <h2 className="text-sm font-medium text-foreground-secondary">
                  Bio
                </h2>
                <p className="mt-1 text-foreground">{profile.bio}</p>
              </div>
            )}

            {profile.interests && (
              <div className="mt-4">
                <h2 className="text-sm font-medium text-foreground-secondary">
                  Interests
                </h2>
                <p className="mt-1 text-foreground">{profile.interests}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-4">
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {social?.twitter && (
                <a
                  href={`https://twitter.com/${social.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Twitter
                </a>
              )}
              {social?.instagram && (
                <a
                  href={`https://instagram.com/${social.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
