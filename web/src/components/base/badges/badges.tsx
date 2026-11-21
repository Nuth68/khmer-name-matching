import React from "react";

export interface BadgeWithDotProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: "success" | "gray" | "primary" | "warning" | "error" | "blue";
  type?: "modern" | "badge";
  className?: string;
}

export const BadgeWithDot: React.FC<BadgeWithDotProps> = ({
  children,
  size = "sm",
  color = "gray",
  type = "modern",
  className = "",
}) => {
  return (
    <span
      className={`badge-with-dot badge-with-dot--${size} badge-with-dot--${color} badge-with-dot--${type} ${className}`}
    >
      <i className="badge-with-dot__indicator" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
};

export default BadgeWithDot;
