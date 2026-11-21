import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bell,
  Building2,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sun,
  RefreshCw,
  X,
} from "lucide-react";
import { SidebarLanguage, sidebarNavigation, UserRole } from "./sidebarConfig";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "critical",
    icon: AlertCircle,
    title: "386 high-confidence duplicates",
    desc: "Pairs exceeding 90% similarity need review.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    icon: Info,
    title: "Data quality dropped to 94.8%",
    desc: "Invalid values increased by 4% this week.",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    type: "success",
    icon: CheckCircle2,
    title: "Quality check completed",
    desc: "2,418 records flagged for missing fields.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    type: "info",
    icon: Info,
    title: "Import batch #2048 finished",
    desc: "12,400 records processed, 128 need review.",
    time: "3 hr ago",
    read: true,
  },
  {
    id: 5,
    type: "info",
    icon: Info,
    title: "Monthly quality report ready",
    desc: "May 2025 summary is available to download.",
    time: "Yesterday",
    read: true,
  },
];

const WORKSPACES = [
  { id: "national", name: "National Identity Registry", code: "NIR", initials: "NI", logo: "/assets/gic-logo.png" },
  { id: "civil", name: "Civil Registration", code: "CRD", initials: "CR", logo: null },
  { id: "research", name: "Khmer Name Research Lab", code: "KNR", initials: "KR", logo: null },
];

type Props = {
  activeRoute: string;
  onNavigate: (route: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  role?: UserRole;
  language: SidebarLanguage;
  onLanguageChange: (language: SidebarLanguage) => void;
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
};

export default function AppSidebar({
  activeRoute,
  onNavigate,
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileClose,
  role = "admin",
  language,
  onLanguageChange,
  dark,
  onDarkChange,
}: Props) {
  const availableGroups = useMemo(
    () =>
      sidebarNavigation
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !item.roles || item.roles.includes(role)),
        }))
        .filter((group) => group.items.length > 0),
    [role],
  );
  const routeGroup =
    availableGroups.find((group) => group.items.some((item) => item.route === activeRoute))?.id ??
    "overview";
  const [selectedGroup, setSelectedGroup] = useState(routeGroup);
  useEffect(() => setSelectedGroup(routeGroup), [routeGroup]);
  useEffect(() => {
    const currentGroup = availableGroups.find((item) => item.id === routeGroup);
    if (currentGroup?.items.length === 1 && window.matchMedia("(min-width: 821px)").matches) {
      onCollapsedChange(true);
    }
  }, [availableGroups, routeGroup, onCollapsedChange]);

  const group = availableGroups.find((item) => item.id === selectedGroup) ?? availableGroups[0];
  const localize = (english: string, khmer: string) => (language === "km" ? khmer : english);
  const navigate = (route: string) => {
    onNavigate(route);
    onMobileClose();
  };

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(WORKSPACES[0].id);
  const profileRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const currentWorkspace =
    WORKSPACES.find((workspace) => workspace.id === workspaceId) ?? WORKSPACES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        notifRef.current && !notifRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
      if (
        profileRef.current && !profileRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
        setWorkspaceOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <aside
      className={`km-sidebar km-two-rail ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""} ${notifOpen ? "is-notif-open" : ""}`}
      aria-label="Primary navigation"
    >
      <div className="km-icon-rail">
        <button
          className="km-rail-logo"
          onClick={() => {
            navigate("Dashboard");
            if (window.matchMedia("(min-width: 821px)").matches) onCollapsedChange(true);
          }}
          aria-label="Dashboard"
          title="Dashboard"
        >
          <img
            src="/assets/gic-logo.png"
            alt="GIC Logo"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "./assets/gic-logo.png";
            }}
          />
        </button>

        <nav className="km-rail-groups" aria-label="Navigation groups">
          {availableGroups.map((item) => {
            const Icon = item.icon;
            const active = item.id === selectedGroup;
            return (
              <button
                className={active ? "is-active" : ""}
                key={item.id}
                onClick={() => {
                  if (item.items.length === 1) {
                    navigate(item.items[0].route);
                    if (window.matchMedia("(min-width: 821px)").matches) {
                      onCollapsedChange(true);
                    }
                    return;
                  }
                  setSelectedGroup(item.id);
                  if (collapsed) onCollapsedChange(false);
                }}
                aria-label={localize(item.label, item.labelKm)}
                title={localize(item.label, item.labelKm)}
              >
                <Icon size={22} />
              </button>
            );
          })}
        </nav>

        <div className="km-rail-utilities">
          <button onClick={() => onNavigate("Settings")} aria-label="Settings" title="Settings">
            <Settings size={21} />
          </button>

          {/* Notification Bell */}
          <div className="km-notif-wrap">
            <button
              ref={bellRef}
              className={`km-notif-btn${notifOpen ? " is-open" : ""}`}
              aria-label={`Notifications — ${unreadCount} unread`}
              title="Notifications"
              onClick={() => setNotifOpen((v) => !v)}
            >
              <Bell size={21} />
              {unreadCount > 0 && (
                <span className="km-notif-badge">{unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div ref={notifRef} className="km-notif-panel" role="dialog" aria-label="Notifications">
                <div className="km-notif-header">
                  <span>Notifications</span>
                  <div className="km-notif-header-actions">
                    {unreadCount > 0 && (
                      <button
                        className="km-notif-mark-all-btn"
                        onClick={markAllRead}
                        aria-label={language === "km" ? "សម្គាល់ថាបានអានទាំងអស់" : "Mark all as read"}
                        title={language === "km" ? "សម្គាល់ថាបានអានទាំងអស់" : "Mark all as read"}
                      >
                        <CheckCheck size={16} />
                      </button>
                    )}
                    <button className="km-notif-close" onClick={() => setNotifOpen(false)} aria-label="Close">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="km-notif-list">
                  {notifications.length === 0 && (
                    <div className="km-notif-empty">
                      <Bell size={28} />
                      <span>All caught up!</span>
                    </div>
                  )}
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className={`km-notif-item km-notif-${n.type}${n.read ? " is-read" : ""}`}
                      >
                        <div className="km-notif-icon-wrap">
                          <Icon size={16} />
                        </div>
                        <div className="km-notif-body">
                          <strong>{n.title}</strong>
                          <span>{n.desc}</span>
                          <time>{n.time}</time>
                        </div>
                        <button
                          className="km-notif-dismiss"
                          onClick={() => dismiss(n.id)}
                          aria-label="Dismiss"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="km-appearance" aria-label="Appearance">
            <button
              className={!dark ? "is-active" : ""}
              onClick={() => onDarkChange(false)}
              aria-label="Light mode"
            >
              <Sun size={17} />
            </button>
            <button
              className={dark ? "is-active" : ""}
              onClick={() => onDarkChange(true)}
              aria-label="Dark mode"
            >
              <Moon size={17} />
            </button>
          </div>
          <div className="km-profile-wrap" ref={profileRef}>
            <button
              ref={avatarRef}
              className={`km-rail-avatar ${profileOpen ? "is-open" : ""}`}
              onClick={() => {
                setProfileOpen((open) => !open);
                setNotifOpen(false);
              }}
              aria-label="Open profile and workspace menu"
              aria-haspopup="dialog"
              aria-expanded={profileOpen}
              title="Chenda Sok — Administrator"
            >
              CS
            </button>

            {profileOpen && (
              <div
                className={`km-profile-popover ${workspaceOpen ? "has-workspace-list" : ""}`}
                role="dialog"
                aria-label="Profile and workspace"
              >
                <div className="km-profile-popover-head">
                  <div className="km-profile-avatar">
                    <span>CS</span>
                    <b>Admin</b>
                  </div>
                  <div>
                    <strong>Chenda Sok</strong>
                    <small>chenda.sok@registry.gov.kh</small>
                  </div>
                </div>

                <div className="km-workspace-section">
                  <div className="km-workspace-label">
                    <Building2 size={13} />
                    <span>Organization</span>
                  </div>
                  <button
                    className={`km-workspace-trigger ${workspaceOpen ? "is-open" : ""}`}
                    type="button"
                    onClick={() => setWorkspaceOpen((open) => !open)}
                    aria-expanded={workspaceOpen}
                  >
                    <span>
                      {currentWorkspace.logo ? (
                        <img src={currentWorkspace.logo} alt="" />
                      ) : (
                        currentWorkspace.initials
                      )}
                    </span>
                    <div>
                      <strong>{currentWorkspace.name}</strong>
                      <small>{currentWorkspace.code} workspace</small>
                    </div>
                    <ChevronRight size={17} />
                  </button>

                </div>

                {workspaceOpen && (
                  <div className="km-workspace-list" role="listbox" aria-label="Organizations">
                    {WORKSPACES.map((workspace) => {
                      const selected = workspace.id === workspaceId;
                      return (
                        <button
                          type="button"
                          key={workspace.id}
                          className={selected ? "is-selected" : ""}
                          onClick={() => {
                            setWorkspaceId(workspace.id);
                            setWorkspaceOpen(false);
                          }}
                          role="option"
                          aria-selected={selected}
                        >
                          <span>
                            {workspace.logo ? <img src={workspace.logo} alt="" /> : workspace.initials}
                          </span>
                          <div>
                            <strong>{workspace.name}</strong>
                            <small>{workspace.code}</small>
                          </div>
                          {selected && <Check size={15} />}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="km-profile-actions">
                  <button
                    className="km-switch-account-button"
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setWorkspaceOpen(false);
                      window.dispatchEvent(new CustomEvent("k-id:switch-account"));
                    }}
                  >
                    <RefreshCw size={16} /> Switch account
                  </button>
                  <button
                    className="km-logout-button"
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setWorkspaceOpen(false);
                      window.dispatchEvent(new CustomEvent("k-id:logout"));
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="km-context-panel">
        <header className="km-context-header">
          <button className="km-mobile-close" onClick={onMobileClose} aria-label="Close navigation">
            <X size={20} />
          </button>
        </header>

        <div className="km-context-title">{localize(group.label, group.labelKm)}</div>
        <nav className="km-context-items">
          {group.items.map((item) => {
            const Icon = item.icon;
            const active = item.route === activeRoute;
            return (
              <button
                className={active ? "is-active" : ""}
                key={item.id}
                onClick={() => navigate(item.route)}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} />
                <span>{localize(item.label, item.labelKm)}</span>
                {item.badge !== undefined && <b>{item.badge}</b>}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        className="km-edge-collapse"
        onClick={() => onCollapsedChange(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
      </button>
    </aside>
  );
}
