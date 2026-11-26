import { ChevronRight, LayoutDashboard, Menu, Settings, UserRound } from "lucide-react";
import { SidebarGroup, SidebarItem, sidebarNavigation, SidebarLanguage } from "./sidebarConfig";

type Props = {
  activeRoute: string;
  onNavigate: (route: string) => void;
  language: SidebarLanguage;
  onMobileOpen: () => void;
  detailItem?: {
    id: string;
    label: string;
    labelKm?: string;
    icon?: any;
  } | null;
  onClearDetail?: () => void;
};

// Aliases and special routes map
const routeAliases: Record<string, { label: string; labelKm: string; groupKey?: string }> = {
  "Khmer Romanisation": {
    label: "Romanisation",
    labelKm: "ការសរសេរជាអក្សរឡាតាំង",
    groupKey: "language",
  },
  "Smart Search": {
    label: "Smart Name Search",
    labelKm: "ស្វែងរកឈ្មោះឆ្លាតវៃ",
    groupKey: "matching",
  },
  "Review & Merge": {
    label: "Manual Review",
    labelKm: "ការពិនិត្យដោយដៃ",
    groupKey: "matching",
  },
  "Import & Export": {
    label: "Import Data",
    labelKm: "នាំចូលទិន្នន័យ",
    groupKey: "data",
  },
  "My Profile": {
    label: "My Profile",
    labelKm: "ប្រវត្តិរូបរបស់ខ្ញុំ",
    groupKey: "system",
  },
};

export default function AppBreadcrumb({
  activeRoute,
  onNavigate,
  language,
  onMobileOpen,
  detailItem,
  onClearDetail,
}: Props) {
  let group: SidebarGroup | undefined = undefined;
  let item: SidebarItem | undefined = undefined;

  // Direct handler for standalone Settings
  if (activeRoute === "Settings") {
    group = undefined;
    item = {
      id: "settings",
      label: "Settings",
      labelKm: "ការកំណត់",
      route: "Settings",
      icon: Settings,
    };
  } else {
    // Resolve group and item from activeRoute
    group = sidebarNavigation.find((g: SidebarGroup) =>
      g.items.some((it: SidebarItem) => it.route === activeRoute || it.label === activeRoute),
    );
    item = group?.items.find(
      (it: SidebarItem) => it.route === activeRoute || it.label === activeRoute,
    );

    // If not found directly, check aliases
    if (!item && routeAliases[activeRoute]) {
      const alias = routeAliases[activeRoute];
      if (alias.groupKey) {
        group = sidebarNavigation.find((g: SidebarGroup) => g.id === alias.groupKey) || group;
      }
      const realItem = group?.items.find(
        (it: SidebarItem) => it.label === alias.label || it.route === alias.label,
      );
      item = realItem || {
        id: activeRoute.toLowerCase().replace(/\s+/g, "-"),
        label: alias.label,
        labelKm: alias.labelKm,
        route: activeRoute,
        icon: (group?.icon || LayoutDashboard) as any,
      };
    }
  }

  const isNameComparison = activeRoute === "Name Comparison";
  const groupLabel = group
    ? isNameComparison
      ? language === "km"
        ? "ឧបករណ៍ឆ្លាតវៃ"
        : "Intelligent Tools"
      : language === "km"
        ? group.labelKm
        : group.label
    : null;
  const currentLabel = item ? (language === "km" ? item.labelKm : item.label) : activeRoute;
  const GroupIcon = group?.icon;
  const ItemIcon = item?.icon || GroupIcon || LayoutDashboard;

  return (
    <header className="app-breadcrumb-bar" role="banner">
      <div className="breadcrumb-left">
        <button
          className="breadcrumb-mobile-trigger"
          onClick={onMobileOpen}
          aria-label={language === "km" ? "បើកម៉ឺនុយ" : "Open navigation"}
          title={language === "km" ? "បើកម៉ឺនុយ" : "Open navigation"}
        >
          <Menu size={18} />
        </button>

        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            {isNameComparison && (
              <>
                <li className="breadcrumb-item">
                  <button
                    className="breadcrumb-link"
                    onClick={() => onNavigate("Dashboard")}
                    title={language === "km" ? "ផ្ទាំងគ្រប់គ្រង" : "Dashboard"}
                  >
                    <LayoutDashboard size={16} />
                    <span>{language === "km" ? "ផ្ទាំងគ្រប់គ្រង" : "Dashboard"}</span>
                  </button>
                </li>
                <li className="breadcrumb-separator" aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
              </>
            )}
            {group && (
              <>
                <li className="breadcrumb-item">
                  <button
                    className="breadcrumb-link"
                    onClick={() => {
                      if (group?.items[0]) {
                        onNavigate(group.items[0].route);
                      }
                    }}
                    title={groupLabel || undefined}
                  >
                    {GroupIcon && <GroupIcon size={16} />}
                    <span>{groupLabel}</span>
                  </button>
                </li>
                <li className="breadcrumb-separator" aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
              </>
            )}

            {detailItem ? (
              <>
                <li className="breadcrumb-item">
                  <button
                    className="breadcrumb-link"
                    onClick={() => {
                      if (onClearDetail) {
                        onClearDetail();
                      } else if (item) {
                        onNavigate(item.route);
                      }
                    }}
                    title={currentLabel || undefined}
                  >
                    {ItemIcon && <ItemIcon size={16} />}
                    <span>{currentLabel}</span>
                  </button>
                </li>
                <li className="breadcrumb-separator" aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li className="breadcrumb-item is-current" aria-current="page">
                  <span className="breadcrumb-current-text">
                    <UserRound size={16} />
                    <span>
                      {language === "km" && detailItem.labelKm
                        ? detailItem.labelKm
                        : detailItem.label}
                    </span>
                  </span>
                </li>
              </>
            ) : (
              <li className="breadcrumb-item is-current" aria-current="page">
                <span className="breadcrumb-current-text">
                  {ItemIcon && <ItemIcon size={16} />}
                  <span>{currentLabel}</span>
                </span>
              </li>
            )}
          </ol>
        </nav>
      </div>
    </header>
  );
}
