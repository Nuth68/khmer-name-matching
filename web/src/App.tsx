import { useEffect, useState } from "react";
import AppSidebar from "./components/navigation/AppSidebar";
import AppBreadcrumb from "./components/navigation/AppBreadcrumb";
import type { SidebarLanguage } from "./components/navigation/sidebarConfig";
import type { PageKey, IdentityRecord } from "./types";

// Page modules
import {
  CompleteDashboard,
  RecordsPage,
  RecordDetailPage,
  SmartSearchPage,
  ImportExportPage,
  NameComparisonPage,
  DuplicateDetectionPage,
  ReviewMergePage,
  PhoneticMatchingPage,
  KeyboardDetectionPage,
  DocumentScannerPage,
  RomanisationPage,
  DataQualityPage,
  AlgorithmEvaluationPage,
  DeveloperPage,
  SettingsPage,
  OperationalPage,
} from "./pages";

function App() {
  const [active, setActive] = useState<PageKey>("Dashboard");
  const [selectedRecord, setSelectedRecord] = useState<IdentityRecord | null>(null);
  const [collapsed, setCollapsed] = useState(
    () => window.localStorage.getItem("km-sidebar-collapsed") === "true",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState<SidebarLanguage>(
    () => (window.localStorage.getItem("km-sidebar-language") as SidebarLanguage) || "en",
  );

  const handleNavigate = (route: string) => {
    setSelectedRecord(null);
    setActive(route);
  };

  useEffect(() => {
    window.localStorage.setItem("km-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    window.localStorage.setItem("km-sidebar-language", language);
  }, [language]);

  const content = (() => {
    if (active === "Dashboard") return <CompleteDashboard navigate={handleNavigate} />;
    if (active === "All Records") {
      if (selectedRecord) {
        return (
          <RecordDetailPage
            record={selectedRecord}
            onBack={() => setSelectedRecord(null)}
            onUpdateRecord={(updated) => setSelectedRecord(updated)}
          />
        );
      }
      return <RecordsPage onViewRecord={(rec) => setSelectedRecord(rec)} />;
    }
    if (active === "Name Comparison") return <NameComparisonPage />;
    if (active === "Khmer Romanisation" || active === "Romanisation") return <RomanisationPage />;
    if (active === "Keyboard Error Detection") return <KeyboardDetectionPage />;
    if (active === "Phonetic Matching") return <PhoneticMatchingPage />;
    if (active === "Smart Search" || active === "Smart Name Search")
      return (
        <SmartSearchPage
          onViewRecord={(rec) => {
            setSelectedRecord(rec);
            setActive("All Records");
          }}
        />
      );
    if (active === "Duplicate Detection") return <DuplicateDetectionPage navigate={handleNavigate} />;
    if (active === "Review & Merge" || active === "Manual Review") return <ReviewMergePage />;
    if (active === "Document Scanner") return <DocumentScannerPage />;
    if (
      active === "Import & Export" ||
      active === "Import Data" ||
      active === "Import History" ||
      active === "Export Data"
    )
      return <ImportExportPage onNavigate={handleNavigate} />;
    if (active === "Data Quality") return <DataQualityPage />;
    if (active === "Algorithm Evaluation") return <AlgorithmEvaluationPage />;
    if (active === "API Keys" || active === "API Playground")
      return <DeveloperPage title={active} />;
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
          detailItem={
            selectedRecord
              ? {
                  id: selectedRecord.id,
                  label: `${selectedRecord.id} · ${selectedRecord.latin}`,
                  labelKm: `${selectedRecord.id} · ${selectedRecord.khmer}`,
                }
              : null
          }
          onClearDetail={() => setSelectedRecord(null)}
        />
        <main className="content">{content}</main>
      </div>
    </div>
  );
}

export default App;
