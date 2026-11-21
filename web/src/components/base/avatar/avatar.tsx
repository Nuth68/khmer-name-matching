import React, { useState } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  placeholder?: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-14 h-14 text-xl",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  size = "md",
  placeholder,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 select-none ${sizeClasses[size]} ${className}`}
    >
      {placeholder ? (
        placeholder
      ) : src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <span>{getInitials(alt)}</span>
      )}
    </div>
  );
};

export default Avatar;
