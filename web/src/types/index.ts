import React from "react";
export * from "./identity";

export type IconType = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

export type PageKey =
  | "Dashboard"
  | "Name Comparison"
  | "Keyboard Error Detection"
  | "Duplicate Detection"
  | "Review & Merge"
  | "Document Scanner"
  | "Data Quality"
  | "API Keys"
  | string;

export type BadgeTone = "neutral" | "success" | "warning" | "error" | "blue";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
