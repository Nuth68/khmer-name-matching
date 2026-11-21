import {
  Activity,
  BarChart3,
  BookOpen,
  Braces,
  ClipboardCheck,
  Database,
  FileClock,
  FileSearch,
  FileSpreadsheet,
  Fingerprint,
  Gauge,
  History,
  KeyRound,
  Keyboard,
  Languages,
  LayoutDashboard,
  ListChecks,
  Merge,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  UserCog,
  Users,
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
    id: "matching",
    label: "Name Matching",
    labelKm: "ការផ្គូផ្គងឈ្មោះ",
    icon: Fingerprint,
    items: [
      {
        id: "compare",
        label: "Name Comparison",
        labelKm: "ប្រៀបធៀបឈ្មោះ",
        route: "Name Comparison",
        icon: Languages,
      },
      {
        id: "smart-search",
        label: "Smart Name Search",
        labelKm: "ស្វែងរកឈ្មោះឆ្លាតវៃ",
        route: "Smart Name Search",
        icon: Search,
      },
      {
        id: "duplicates",
        label: "Duplicate Detection",
        labelKm: "រកឃើញទិន្នន័យស្ទួន",
        route: "Duplicate Detection",
        icon: Fingerprint,
      },
      {
        id: "manual-review",
        label: "Manual Review",
        labelKm: "ការពិនិត្យដោយដៃ",
        route: "Manual Review",
        icon: Merge,
        badge: 386,
        roles: ["admin", "reviewer"],
      },
      {
        id: "keyboard-errors",
        label: "Keyboard Error Detection",
        labelKm: "រកកំហុសក្តារចុច",
        route: "Keyboard Error Detection",
        icon: Keyboard,
      },
      {
        id: "matching-history",
        label: "Matching History",
        labelKm: "ប្រវត្តិការផ្គូផ្គង",
        route: "Matching History",
        icon: History,
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
        id: "records",
        label: "All Records",
        labelKm: "ទិន្នន័យទាំងអស់",
        route: "All Records",
        icon: Users,
      },
      {
        id: "import",
        label: "Import Data",
        labelKm: "នាំចូលទិន្នន័យ",
        route: "Import Data",
        icon: UploadCloud,
        roles: ["admin", "analyst"],
      },
      {
        id: "import-history",
        label: "Import History",
        labelKm: "ប្រវត្តិនាំចូល",
        route: "Import History",
        icon: FileClock,
      },
      {
        id: "export",
        label: "Export Data",
        labelKm: "នាំចេញទិន្នន័យ",
        route: "Export Data",
        icon: FileSpreadsheet,
        roles: ["admin", "analyst"],
      },
    ],
  },
  {
    id: "language",
    label: "Language Engine",
    labelKm: "ម៉ាស៊ីនភាសា",
    icon: Languages,
    items: [
      {
        id: "romanisation",
        label: "Romanisation",
        labelKm: "ការសរសេរជាអក្សរឡាតាំង",
        route: "Romanisation",
        icon: Languages,
      },
      {
        id: "dictionary",
        label: "Romanisation Dictionary",
        labelKm: "វចនានុក្រមរ៉ូម៉ាំង",
        route: "Romanisation Dictionary",
        icon: BookOpen,
      },
      {
        id: "phonetic-rules",
        label: "Phonetic Rules",
        labelKm: "ច្បាប់សូរសព្ទ",
        route: "Phonetic Rules",
        icon: Activity,
      },
      {
        id: "spelling",
        label: "Spelling Variations",
        labelKm: "បំរែបំរួលអក្ខរាវិរុទ្ធ",
        route: "Spelling Variations",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "research",
    label: "Research & Evaluation",
    labelKm: "ការស្រាវជ្រាវ និងវាយតម្លៃ",
    icon: BarChart3,
    items: [
      {
        id: "test-data",
        label: "Labelled Test Dataset",
        labelKm: "ទិន្នន័យសាកល្បង",
        route: "Labelled Test Dataset",
        icon: ListChecks,
        roles: ["admin", "analyst"],
      },
      {
        id: "evaluation",
        label: "Algorithm Evaluation",
        labelKm: "ការវាយតម្លៃក្បួនដោះស្រាយ",
        route: "Algorithm Evaluation",
        icon: Gauge,
      },
      {
        id: "algorithm-comparison",
        label: "Algorithm Comparison",
        labelKm: "ប្រៀបធៀបក្បួនដោះស្រាយ",
        route: "Algorithm Comparison",
        icon: BarChart3,
      },
      {
        id: "thresholds",
        label: "Threshold Tuning",
        labelKm: "កំណត់កម្រិតផ្គូផ្គង",
        route: "Threshold Tuning",
        icon: SlidersHorizontal,
      },
      {
        id: "performance",
        label: "Performance Reports",
        labelKm: "របាយការណ៍ប្រសិទ្ធភាព",
        route: "Performance Reports",
        icon: FileSearch,
      },
    ],
  },
  {
    id: "developer",
    label: "Developer Tools",
    labelKm: "ឧបករណ៍អ្នកអភិវឌ្ឍន៍",
    icon: Braces,
    items: [
      {
        id: "playground",
        label: "API Playground",
        labelKm: "សាកល្បង API",
        route: "API Playground",
        icon: Braces,
        roles: ["admin", "developer"],
      },
      {
        id: "api-docs",
        label: "API Documentation",
        labelKm: "ឯកសារ API",
        route: "API Documentation",
        icon: BookOpen,
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
      {
        id: "api-logs",
        label: "API Request Logs",
        labelKm: "កំណត់ហេតុ API",
        route: "API Request Logs",
        icon: FileClock,
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
        id: "users",
        label: "User Management",
        labelKm: "គ្រប់គ្រងអ្នកប្រើប្រាស់",
        route: "User Management",
        icon: UserCog,
        roles: ["admin"],
      },
      {
        id: "roles",
        label: "Roles & Permissions",
        labelKm: "តួនាទី និងសិទ្ធិ",
        route: "Roles & Permissions",
        icon: ShieldCheck,
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
