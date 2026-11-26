import {
  BarChart3,
  BookOpen,
  Braces,
  Building2,
  ClipboardCheck,
  Database,
  FileSearch,
  Fingerprint,
  KeyRound,
  Languages,
  LayoutDashboard,
  Merge,
  Search,
  Settings,
  ShieldCheck,
  Users,
  UserCog,
  Wand2,
} from "lucide-react";

export type UserRole = "admin" | "reviewer" | "analyst" | "developer";
export type SidebarLanguage = "en" | "km";

export type SidebarItem = {
  id: string;
  label: string;
  labelKm: string;
  route: string;
  icon: typeof LayoutDashboard;
  roles?: UserRole[];
  badge?: number;
};

export type SidebarGroup = {
  id: string;
  label: string;
  labelKm: string;
  icon: typeof LayoutDashboard;
  items: SidebarItem[];
};

export const sidebarNavigation: SidebarGroup[] = [
  {
    id: "overview",
    label: "Overview",
    labelKm: "ទិដ្ឋភាពទូទៅ",
    icon: LayoutDashboard,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        labelKm: "ផ្ទាំងគ្រប់គ្រង",
        route: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "identity",
    label: "Identity Management",
    labelKm: "ការគ្រប់គ្រងអត្តសញ្ញាណ",
    icon: Users,
    items: [
      {
        id: "records",
        label: "Identity Records",
        labelKm: "កំណត់ត្រាអត្តសញ្ញាណ",
        route: "Identity Records",
        icon: Users,
      },
      {
        id: "duplicates",
        label: "Duplicate Detection",
        labelKm: "រកឃើញទិន្នន័យស្ទួន",
        route: "Duplicate Detection",
        icon: Fingerprint,
      },
      {
        id: "review-merge",
        label: "Review & Merge",
        labelKm: "ពិនិត្យ និងបញ្ចូលគ្នា",
        route: "Review & Merge",
        icon: Merge,
        badge: 386,
        roles: ["admin", "reviewer"],
      },
    ],
  },
  {
    id: "tools",
    label: "Intelligent Tools",
    labelKm: "ឧបករណ៍វៃឆ្លាត",
    icon: Wand2,
    items: [
      {
        id: "name-comparison",
        label: "Name Comparison",
        labelKm: "ប្រៀបធៀបឈ្មោះ",
        route: "Name Comparison",
        icon: Languages,
      },
      {
        id: "romanisation",
        label: "Khmer Romanisation",
        labelKm: "ការសរសេរខ្មែរជាអក្សរឡាតាំង",
        route: "Khmer Romanisation",
        icon: Languages,
      },
      {
        id: "smart-search",
        label: "Smart Search",
        labelKm: "ស្វែងរកឆ្លាតវៃ",
        route: "Smart Search",
        icon: Search,
      },
    ],
  },
  {
    id: "data",
    label: "Data Management",
    labelKm: "ការគ្រប់គ្រងទិន្នន័យ",
    icon: Database,
    items: [
      {
        id: "import-export",
        label: "Import & Export",
        labelKm: "នាំចូល និងនាំចេញ",
        route: "Import & Export",
        icon: Database,
        roles: ["admin", "analyst"],
      },
      {
        id: "data-quality",
        label: "Data Quality",
        labelKm: "គុណភាពទិន្នន័យ",
        route: "Data Quality",
        icon: FileSearch,
      },
      {
        id: "reports",
        label: "Reports & Analytics",
        labelKm: "របាយការណ៍ និងការវិភាគ",
        route: "Reports & Analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    id: "developer",
    label: "Developer",
    labelKm: "អ្នកអភិវឌ្ឍន៍",
    icon: Braces,
    items: [
      {
        id: "api-docs",
        label: "API Documentation",
        labelKm: "ឯកសារ API",
        route: "API Documentation",
        icon: BookOpen,
        roles: ["admin", "developer"],
      },
      {
        id: "playground",
        label: "API Playground",
        labelKm: "សាកល្បង API",
        route: "API Playground",
        icon: Braces,
        roles: ["admin", "developer"],
      },
      {
        id: "api-keys",
        label: "API Keys",
        labelKm: "សោ API",
        route: "API Keys",
        icon: KeyRound,
        roles: ["admin", "developer"],
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    labelKm: "ការគ្រប់គ្រងប្រព័ន្ធ",
    icon: ShieldCheck,
    items: [
      {
        id: "users-roles",
        label: "Users & Roles",
        labelKm: "អ្នកប្រើប្រាស់ និងតួនាទី",
        route: "Users & Roles",
        icon: UserCog,
        roles: ["admin"],
      },
      {
        id: "org-settings",
        label: "Organization Settings",
        labelKm: "ការកំណត់អង្គភាព",
        route: "Organization Settings",
        icon: Building2,
        roles: ["admin"],
      },
      {
        id: "audit",
        label: "Audit Logs",
        labelKm: "កំណត់ហេតុសវនកម្ម",
        route: "Audit Logs",
        icon: ClipboardCheck,
        roles: ["admin"],
      },
    ],
  },
];
