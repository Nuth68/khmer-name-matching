import React from "react";
import { BadgeTone } from "../../types";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
}

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
