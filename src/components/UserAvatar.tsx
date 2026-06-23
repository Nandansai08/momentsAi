'use client';

import { getAvatarColorClass, getInitials } from "@/lib/avatar";
import { DashboardUserProfile } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface UserAvatarProps {
  profile: DashboardUserProfile;
}

/* When deploying the project to a live production server, you must
 add the specific domain/host where your website and image storage will live.
 Also, remember to duplicate these allowed domains in your `next.config.js` file 
 under the `remotePatterns` section, otherwise Next.js will block external avatars 
 from loading (throwing the "hostname is not configured" error).
 Future example: 
 const VALID_URLS = ["http://", "https://", "/", "https://my-awesome-site.com"] 
*/
const VALID_URLS = ["http://", "https://", "/"];

export default function UserAvatar({ profile }: UserAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const avatarUrl = profile.avatar_url;

  const isValidUrl = (url: unknown): url is string => {
    if (typeof url !== "string") return false;
    return VALID_URLS.some((prefix) => url.startsWith(prefix));
  };

  const shouldShowImage = isValidUrl(avatarUrl) && !hasImageError;
  return (
    <div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center font-black border border-violet-100 dark:border-violet-900/50 shrink-0">
      {shouldShowImage ? (
        <Image
          src={avatarUrl}
          alt={profile.full_name || "Avatar"}
          width={40}
          height={40}
          onError={() => {
            console.warn(
              `Failed to resolve or load avatar for user: ${profile.full_name || "Unknown"}. Falling back to initials.`,
            );
            setHasImageError(true);
          }}
          className="size-10 rounded-full object-cover border border-border"
        />
      ) : (
        <div
          role="img"
          aria-label={profile.full_name || "User avatar"}
          className={`size-10 rounded-full flex items-center justify-center font-black border text-white shrink-0 shadow-sm ${getAvatarColorClass(profile.full_name)}`}
        >
          {getInitials(profile.full_name)}
        </div>
      )}
    </div>
  );
}
