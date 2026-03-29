"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";

type ProfileAvatarProps = {
  name: string;
  image?: string | null;
  size?: number;
  className?: string;
  iconClassName?: string;
};

export default function ProfileAvatar({ name, image, size = 24, className = "", iconClassName = "h-3.5 w-3.5" }: ProfileAvatarProps) {
  if (image) {
    const isProtectedLocalAvatar = image.startsWith("/api/users/me/avatar");

    return (
      <Image
        src={image}
        alt={`${name} profile`}
        width={size}
        height={size}
        unoptimized={isProtectedLocalAvatar}
        className={`rounded-full border border-slate-200 object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 ${className}`}
      style={{ width: size, height: size }}
      aria-label={`${name} profile`}
      title={name}
    >
      <UserRound className={iconClassName} />
    </span>
  );
}
