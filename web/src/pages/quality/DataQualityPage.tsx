import { useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  Bell,
  BookOpen,
  Braces,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleGauge,
  ClipboardCheck,
  Code2,
  Copy,
  Database,
  Download,
  Eye,
  FileClock,
  FileSearch,
  FileSpreadsheet,
  FileText,
  Filter,
  Fingerprint,
  History,
  Info,
  KeyRound,
  Keyboard,
  Languages,
  LayoutDashboard,
  Menu,
  Merge,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  UploadCloud,
  UserRound,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import MetricCard from "../../components/common/MetricCard";

export default function DataQualityPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [runningCheck, setRunningCheck] = useState(false);
  const [checkDone, setCheckDone] = useState(false);

  const runCheck = () => {
    setRunningCheck(true);
    setCheckDone(false);
    setTimeout(() => {
      setRunningCheck(false);
      setCheckDone(true);
    }, 2200);
  };

  const dimensions = [
    {
      label: "Completeness",
      score: 97.2,
      color: "#147d6b",
      bg: "#e8f5f1",
      issues: 142,
      desc: "Required fields present",
    },
    {
      label: "Uniqueness",
      score: 99.0,
      color: "#147d6b",
      bg: "#e8f5f1",
      issues: 1284,
      desc: "Duplicate-free records",
    },
    {
      label: "Validity",
      score: 96.8,
      color: "#d97706",
      bg: "#fffbeb",
      issues: 386,
      desc: "Format & value accuracy",
    },
    {
      label: "Consistency",
      score: 94.1,
      color: "#d97706",
      bg: "#fffbeb",
      issues: 742,
      desc: "Cross-field agreement",
    },
    {
      label: "Accuracy",
      score: 98.4,
      color: "#147d6b",
      bg: "#e8f5f1",
      issues: 204,
      desc: "Correct real-world data",
    },
    {
      label: "Timeliness",
      score: 92.3,
      color: "#dc2626",
      bg: "#fef2f2",
      issues: 918,
      desc: "Up-to-date information",
    },
  ];

  const issues = [
    {
      label: "Missing fields",
      count: "2,418",
      pct: "1.9%",
      icon: AlertCircle,
      tone: "amber" as const,
      priority: "High",
      trend: "▼ 12% this week",
    },
    {
      label: "Invalid values",
      count: "386",
      pct: "0.3%",
      icon: X,
      tone: "red" as const,
      priority: "Critical",
      trend: "▲ 4% this week",
    },
    {
      label: "Duplicate records",
      count: "1,284",
      pct: "1.0%",
      icon: Fingerprint,
      tone: "blue" as const,
      priority: "High",
      trend: "▼ 8% this week",
    },
    {
      label: "Inconsistent names",
      count: "742",
      pct: "0.6%",
      icon: Languages,
      tone: "violet" as const,
      priority: "Medium",
      trend: "— Stable",
    },
  ];

  const recommendations = [
    {
      title: "Review high-confidence duplicates",
      detail: "386 pairs have over 90% similarity score",
      gain: "+1.8 pts",
      action: "Review now",
      urgency: "critical",
    },
    {
      title: "Complete missing dates of birth",
      detail: "1,205 records missing this required field",
      gain: "+0.9 pts",
      action: "View records",
      urgency: "high",
    },
    {
      title: "Normalize phone number formats",
      detail: "384 values can be corrected in bulk",
      gain: "+0.4 pts",
      action: "Bulk fix",
      urgency: "medium",
    },
    {
      title: "Standardize romanisation variants",
      detail: "742 name pairs with inconsistent spelling",
      gain: "+0.3 pts",
      action: "Review",
      urgency: "medium",
    },
    {
      title: "Re-validate expired document IDs",
      detail: "918 records haven't been verified in 24+ months",
      gain: "+0.2 pts",
      action: "Flag records",
      urgency: "low",
    },
  ];

  return (
    <>
      <PageHeader
        title="Data Quality"
        description="Monitor, score and resolve identity record quality across all dimensions"
      >
        <Button variant="secondary">
          <Download size={16} /> Export report
        </Button>
        <Button onClick={runCheck} disabled={runningCheck}>
          {runningCheck ? (
            <>
              <RefreshCw size={16} className="spin" /> Running check…
            </>
          ) : checkDone ? (
            <>
              <CheckCircle2 size={16} /> Check complete
            </>
          ) : (
            <>
              <Zap size={16} /> Run quality check
            </>
          )}
        </Button>
      </PageHeader>

      {/* Tabs */}
      <div className="dq-tabs">
        {["overview", "issues", "recommendations"].map((tab) => (
          <button
            key={tab}
            className={`dq-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          {/* Score Hero */}
          <div className="dq-hero card">
            <div className="dq-hero-left">
              <div className="dq-score-ring-wrap">
                <svg viewBox="0 0 120 120" className="dq-ring-svg">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e8f5f1" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#147d6b"
                    strokeWidth="12"
                    strokeDasharray={`${0.948 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="dq-ring-label">
                  <span className="dq-ring-score">94.8</span>
                  <span className="dq-ring-max">/100</span>
                </div>
              </div>
              <div className="dq-hero-meta">
                <div className="dq-score-grade">
                  <CheckCircle2 size={18} /> Strong — Grade A
                </div>
                <p className="dq-score-desc">
                  Your identity registry meets high quality standards. Address duplicate candidates
                  and missing fields to reach 96+.
                </p>
                <div className="dq-score-trend">
                  <span className="dq-trend-up">▲ +1.2 pts</span> vs last month
                </div>
              </div>
            </div>
            <div className="dq-hero-dims">
              {dimensions.map((d) => (
                <div key={d.label} className="dq-dim-row">
                  <span className="dq-dim-label">{d.label}</span>
                  <div className="dq-dim-bar-wrap">
                    <div
                      className="dq-dim-bar"
                      style={{ width: `${d.score}%`, background: d.color }}
                    />
                  </div>
                  <span className="dq-dim-score" style={{ color: d.color }}>
                    {d.score}%
                  </span>
                  <span className="dq-dim-issues">{d.issues.toLocaleString()} issues</span>
                </div>
              ))}
            </div>
          </div>

          {/* Issue cards */}
          <div className="dq-issue-grid">
            {issues.map((issue) => {
              const Icon = issue.icon;
              const toneColors: Record<string, { color: string; bg: string }> = {
                amber: { color: "#d97706", bg: "#fffbeb" },
                red: { color: "#dc2626", bg: "#fef2f2" },
                blue: { color: "#2563eb", bg: "#eff6ff" },
                violet: { color: "#7c3aed", bg: "#f5f3ff" },
              };
              const tc = toneColors[issue.tone];
              return (
                <button className="dq-issue-card card" key={issue.label}>
                  <div className="dq-issue-top">
                    <div className="dq-issue-icon" style={{ background: tc.bg, color: tc.color }}>
                      <Icon size={20} />
                    </div>
                    <span className={`dq-priority dq-priority-${issue.priority.toLowerCase()}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="dq-issue-count">{issue.count}</div>
                  <div className="dq-issue-label">{issue.label}</div>
                  <div className="dq-issue-pct">{issue.pct} of records</div>
                  <div className="dq-issue-trend">{issue.trend}</div>
                  <div className="dq-issue-cta">
                    Resolve <ArrowRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Top recommendations preview */}
          <section className="card dq-reco-section">
            <div className="dq-reco-header">
              <div>
                <h2>Top recommendations</h2>
              </div>
              <button className="dq-view-all" onClick={() => setActiveTab("recommendations")}>
                View all <ChevronRight size={15} />
              </button>
            </div>
            {recommendations.slice(0, 3).map((r, i) => (
              <div className="dq-reco-row" key={r.title}>
                <span className="dq-reco-rank">{i + 1}</span>
                <div className="dq-reco-info">
                  <strong>{r.title}</strong>
                  <span>{r.detail}</span>
                </div>
                <Badge tone="success">{r.gain}</Badge>
                <Button variant="secondary">{r.action}</Button>
              </div>
            ))}
          </section>
        </>
      )}

      {activeTab === "issues" && (
        <>
          <div className="dq-issue-grid">
            {issues.map((issue) => {
              const Icon = issue.icon;
              const toneColors: Record<string, { color: string; bg: string }> = {
                amber: { color: "#d97706", bg: "#fffbeb" },
                red: { color: "#dc2626", bg: "#fef2f2" },
                blue: { color: "#2563eb", bg: "#eff6ff" },
                violet: { color: "#7c3aed", bg: "#f5f3ff" },
              };
              const tc = toneColors[issue.tone];
              return (
                <button className="dq-issue-card card" key={issue.label}>
                  <div className="dq-issue-top">
                    <div className="dq-issue-icon" style={{ background: tc.bg, color: tc.color }}>
                      <Icon size={20} />
                    </div>
                    <span className={`dq-priority dq-priority-${issue.priority.toLowerCase()}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="dq-issue-count">{issue.count}</div>
                  <div className="dq-issue-label">{issue.label}</div>
                  <div className="dq-issue-pct">{issue.pct} of records</div>
                  <div className="dq-issue-trend">{issue.trend}</div>
                  <div className="dq-issue-cta">
                    Resolve <ArrowRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>
          <section className="card" style={{ padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 700 }}>
              Issue breakdown by field
            </h2>
            {[
              { field: "Date of birth", missing: 1205, invalid: 48, pct: "0.98%" },
              { field: "Phone number", missing: 302, invalid: 384, pct: "0.54%" },
              { field: "National ID", missing: 182, invalid: 94, pct: "0.22%" },
              { field: "Address province", missing: 729, invalid: 0, pct: "0.58%" },
            ].map((row) => (
              <div key={row.field} className="dq-field-row">
                <span className="dq-field-name">{row.field}</span>
                <div className="dq-field-bars">
                  {row.missing > 0 && (
                    <div
                      className="dq-field-seg dq-field-missing"
                      style={{ flex: row.missing }}
                      title={`Missing: ${row.missing}`}
                    />
                  )}
                  {row.invalid > 0 && (
                    <div
                      className="dq-field-seg dq-field-invalid"
                      style={{ flex: row.invalid }}
                      title={`Invalid: ${row.invalid}`}
                    />
                  )}
                  <div
                    className="dq-field-seg dq-field-ok"
                    style={{ flex: 128642 - row.missing - row.invalid }}
                  />
                </div>
                <span className="dq-field-pct">{row.pct}</span>
              </div>
            ))}
            <div className="dq-field-legend">
              <span>
                <i className="dq-leg dq-leg-missing" />
                Missing
              </span>
              <span>
                <i className="dq-leg dq-leg-invalid" />
                Invalid
              </span>
              <span>
                <i className="dq-leg dq-leg-ok" />
                OK
              </span>
            </div>
          </section>
        </>
      )}

      {activeTab === "recommendations" && (
        <section className="card dq-reco-section">
          <div className="dq-reco-header">
            <div>
              <h2>Recommended actions</h2>
            </div>
          </div>
          {recommendations.map((r, i) => (
            <div className="dq-reco-row" key={r.title}>
              <span className="dq-reco-rank">{i + 1}</span>
              <div className="dq-reco-info">
                <strong>{r.title}</strong>
                <span>{r.detail}</span>
              </div>
              <span className={`dq-urgency dq-urgency-${r.urgency}`}>{r.urgency}</span>
              <Badge tone="success">{r.gain}</Badge>
              <Button variant="secondary">{r.action}</Button>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
