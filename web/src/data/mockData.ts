import {
  Activity,
  BookOpen,
  CircleGauge,
  ClipboardCheck,
  Code2,
  Database,
  FileClock,
  FileSearch,
  FileText,
  Fingerprint,
  History,
  KeyRound,
  Keyboard,
  Languages,
  LayoutDashboard,
  Merge,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PageKey, IconType } from "../types";

export const groups: { label: string; items: { label: PageKey; icon: IconType }[] }[] = [
  { label: "Overview", items: [{ label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Identity Management",
    items: [
      { label: "All Records", icon: Users },
      { label: "Duplicate Detection", icon: Fingerprint },
      { label: "Review & Merge", icon: Merge },
      { label: "Identity History", icon: History },
    ],
  },
  {
    label: "Intelligent Tools",
    items: [
      { label: "Name Comparison", icon: Languages },
      { label: "Khmer Romanisation", icon: Sparkles },
      { label: "Keyboard Error Detection", icon: Keyboard },
      { label: "Phonetic Matching", icon: Activity },
      { label: "Document Scanner", icon: ScanLine },
      { label: "Smart Search", icon: FileSearch },
    ],
  },
  {
    label: "Data Management",
    items: [
      { label: "Import & Export", icon: Database },
      { label: "Cross-Database Matching", icon: Activity },
      { label: "Data Quality", icon: CircleGauge },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Analytics Overview", icon: Activity },
      { label: "Algorithm Evaluation", icon: CircleGauge },
      { label: "Reports", icon: FileText },
    ],
  },
  {
    label: "Developer",
    items: [
      { label: "API Keys", icon: KeyRound },
      { label: "API Playground", icon: Code2 },
      { label: "API Documentation", icon: BookOpen },
      { label: "Request Logs", icon: FileClock },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Organizations", icon: Database },
      { label: "Users & Roles", icon: ShieldCheck },
      { label: "Audit Logs", icon: ClipboardCheck },
    ],
  },
];

export const chartData = [
  { day: "Mon", matches: 480, verified: 320 },
  { day: "Tue", matches: 620, verified: 390 },
  { day: "Wed", matches: 540, verified: 420 },
  { day: "Thu", matches: 790, verified: 530 },
  { day: "Fri", matches: 680, verified: 480 },
  { day: "Sat", matches: 830, verified: 590 },
  { day: "Sun", matches: 910, verified: 650 },
];

export const records = [
  {
    id: "KID-008421",
    a: "សុខ ដារ៉ា",
    b: "Sok Dara",
    detail: "DOB, phone and address match",
    score: 96,
    status: "Pending",
  },
  {
    id: "KID-008378",
    a: "ចាន់ សុភា",
    b: "Chan Sophea",
    detail: "DOB and document number match",
    score: 93,
    status: "Pending",
  },
  {
    id: "KID-008209",
    a: "លី ស្រីពេជ្រ",
    b: "Ly Sreypich",
    detail: "Phone and commune match",
    score: 89,
    status: "In review",
  },
  {
    id: "KID-007956",
    a: "ហេង វណ្ណា",
    b: "Heng Vanna",
    detail: "Name and address similarity",
    score: 85,
    status: "Pending",
  },
  {
    id: "KID-007812",
    a: "ជា មករា",
    b: "Chea Makara",
    detail: "Document number partially matches",
    score: 81,
    status: "Resolved",
  },
];
