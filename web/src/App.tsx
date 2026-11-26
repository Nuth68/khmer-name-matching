import { useEffect, useState } from "react";
import AppSidebar from "./components/navigation/AppSidebar";
import AppBreadcrumb from "./components/navigation/AppBreadcrumb";
import type { SidebarLanguage } from "./components/navigation/sidebarConfig";
import type { PageKey } from "./types";

// Page modules
import {
  CompleteDashboard,
  RecordsPage,
  SmartSearchPage,
  ImportExportPage,
  NameComparisonPage,
  DuplicateDetectionPage,
  ReviewMergePage,
  RomanisationPage,
  RomanisationDictionaryPage,
  DataQualityPage,
  DeveloperPage,
  SettingsPage,
  OperationalPage,
} from "./pages";

function App() {
  const [active, setActive] = useState<PageKey>("Dashboard");
  const [collapsed, setCollapsed] = useState(
    () => window.localStorage.getItem("km-sidebar-collapsed") === "true",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState<SidebarLanguage>(
    () => (window.localStorage.getItem("km-sidebar-language") as SidebarLanguage) || "en",
  );

  const handleNavigate = (route: string) => {
    setActive(route);
  };

  useEffect(() => {
    window.localStorage.setItem("km-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    window.localStorage.setItem("km-sidebar-language", language);
  }, [language]);

  // Each view owns the top of the content area. Do not carry a previous
  // page's scroll position into the next route (for example, opening
  // Identity Records while Duplicate Detection is scrolled down).
  useEffect(() => {
    document.querySelector<HTMLElement>(".app-main")?.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [active]);

  const content = (() => {
    if (active === "Dashboard") return <CompleteDashboard navigate={handleNavigate} />;
    // Identity Management
    if (active === "Identity Records") {
      return <RecordsPage />;
    }
    if (active === "Duplicate Detection")
      return <DuplicateDetectionPage navigate={handleNavigate} />;
    if (active === "Review & Merge") return <ReviewMergePage />;
    // Intelligent Tools
    if (active === "Name Comparison") return <NameComparisonPage />;
<<<<<<< Updated upstream
    if (active === "Khmer Romanisation" || active === "Romanisation") return <RomanisationPage />;
    if (active === "Romanisation Dictionary")
      return <RomanisationDictionaryPage />;
    if (active === "Keyboard Error Detection") return <KeyboardDetectionPage />;
    if (active === "Phonetic Matching") return <PhoneticMatchingPage />;
    if (active === "Smart Search" || active === "Smart Name Search")
=======
    if (active === "Khmer Romanisation") return <RomanisationPage />;
    if (active === "Smart Search")
>>>>>>> Stashed changes
      return (
        <SmartSearchPage
          onViewRecord={() => {
            setActive("Identity Records");
          }}
        />
      );
    // Data Management
    if (active === "Import & Export") return <ImportExportPage onNavigate={handleNavigate} />;
    if (active === "Data Quality") return <DataQualityPage />;
    // Developer
    if (active === "API Documentation" || active === "API Playground" || active === "API Keys")
      return <DeveloperPage title={active} />;
    // Settings
    if (active === "Settings") return <SettingsPage />;
    return <OperationalPage title={active} />;
  })();

  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <AppSidebar
        activeRoute={active}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        role="admin"
        language={language}
        onLanguageChange={setLanguage}
        dark={dark}
        onDarkChange={setDark}
      />
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="app-main">
        <AppBreadcrumb
          activeRoute={active}
          onNavigate={handleNavigate}
          language={language}
          onMobileOpen={() => setMobileOpen(true)}
        />
        <main className="content">{content}</main>
      </div>
    </div>
  );
}

export default App;
