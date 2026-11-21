import { useState } from "react";
import {
  Activity, AlertCircle, ArrowLeftRight, ArrowRight, Bell, BookOpen, Braces,
CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
CircleGauge, ClipboardCheck, Code2, Copy, Database, Download, Eye,
FileClock, FileSearch, FileSpreadsheet, FileText, Filter, Fingerprint,
History, Info, KeyRound, Keyboard, Languages, LayoutDashboard, Menu,
Merge, Moon, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Plus,
RefreshCw, ScanLine, Search, Settings, ShieldCheck, SlidersHorizontal,
Sparkles, Sun, Trash2, UploadCloud, UserRound, UserPlus, Users, X, Zap
} from "lucide-react";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

export default function SettingsPage() {
  const [section, setSection] = useState("Profile");
  const [saved, setSaved] = useState(false);
  const [threshold, setThreshold] = useState("85");

  const navItems = [
    { id: "Profile", label: "Profile & Account", icon: UserRound },
    { id: "Matching", label: "Matching Engine", icon: SlidersHorizontal },
    { id: "Security", label: "Security & Access", icon: KeyRound },
    { id: "Language", label: "Language & Script", icon: Languages },
    { id: "Appearance", label: "Appearance", icon: Sun },
    { id: "Notifications", label: "Notifications", icon: Bell },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <>
      <PageHeader title="Settings" description="Manage your account, matching preferences and workspace configuration">
        <Button onClick={handleSave}>
          <Check size={16} /> Save changes
        </Button>
      </PageHeader>

      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={section === item.id ? "active" : ""}
                key={item.id}
                onClick={() => setSection(item.id)}
                type="button"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <section className="settings-panel">
          <div className="settings-heading">
            <h2>{navItems.find((n) => n.id === section)?.label}</h2>
          </div>

          {section === "Profile" && (
            <div>
              <div className="settings-profile-card">
                <div className="settings-avatar-circle" aria-hidden="true">
                  CS
                </div>
                <div className="settings-profile-meta">
                  <div className="settings-profile-name-row">
                    <span className="settings-profile-name">Chenda Sok</span>
                    <span className="settings-profile-badge">
                      <ShieldCheck size={12} /> Administrator
                    </span>
                  </div>
                  <div className="settings-profile-email">chenda@registry.gov.kh • National Registry of Cambodia</div>
                </div>
                <div className="settings-profile-actions">
                  <button className="settings-btn-outline" type="button">
                    <UploadCloud size={15} /> Change photo
                  </button>
                  <button className="settings-btn-ghost" type="button">
                    Remove
                  </button>
                </div>
              </div>

              <div className="settings-form">
                <div className="settings-field">
                  <label htmlFor="pf-fullname">Full name</label>
                  <input id="pf-fullname" defaultValue="Chenda Sok" />
                </div>
                <div className="settings-field">
                  <label htmlFor="pf-email">Email address</label>
                  <input id="pf-email" type="email" defaultValue="chenda@registry.gov.kh" />
                </div>
                <div className="settings-field">
                  <label htmlFor="pf-job">Job title</label>
                  <input id="pf-job" defaultValue="Identity Administrator" />
                </div>
                <div className="settings-field">
                  <label htmlFor="pf-phone">Phone number</label>
                  <input id="pf-phone" defaultValue="+855 23 888 999" />
                </div>
                <div className="settings-field">
                  <label htmlFor="pf-org">Organization / Agency</label>
                  <input id="pf-org" defaultValue="National Registry of Cambodia (GDI)" disabled />
                </div>
                <div className="settings-field">
                  <label htmlFor="pf-dept">Division / Department</label>
                  <input id="pf-dept" defaultValue="Biometric & Civil Registration Bureau" />
                </div>
                <div className="settings-field">
                  <label htmlFor="pf-tz">Timezone</label>
                  <select id="pf-tz" defaultValue="Asia/Phnom_Penh">
                    <option value="Asia/Phnom_Penh">Asia/Phnom_Penh (GMT+7) — Indochina Time</option>
                    <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                  </select>
                </div>
                <div className="settings-field">
                  <label htmlFor="pf-datefmt">Date format</label>
                  <select id="pf-datefmt" defaultValue="DD/MM/YYYY">
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 19/11/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US format)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {section === "Matching" && (
            <div className="settings-list">
              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Default similarity threshold</strong>
                  <span>Minimum confidence score required to flag potential duplicate identities ({threshold}%).</span>
                </div>
                <select
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  style={{ width: "220px", height: "42px", borderRadius: "8px", padding: "0 10px", fontSize: "13.5px" }}
                >
                  <option value="80">80% — Loose matching</option>
                  <option value="85">85% — Balanced (Recommended)</option>
                  <option value="90">90% — Strict matching</option>
                  <option value="95">95% — High confidence only</option>
                </select>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Khmer romanisation expansion</strong>
                  <span>Automatically generate and match phonetic Latin variants for Khmer names during search and indexing.</span>
                </div>
                <label className="settings-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="settings-slider" />
                </label>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Phonetic pronunciation scoring</strong>
                  <span>Evaluate syllable sound similarity in addition to character-level Levenshtein distance.</span>
                </div>
                <label className="settings-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="settings-slider" />
                </label>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Subscript consonant normalization (ជើងអក្សរ)</strong>
                  <span>Treat Coeng (U+17D2) combinations and equivalent visual spellings consistently.</span>
                </div>
                <label className="settings-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="settings-slider" />
                </label>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Automated duplicate candidate flagging</strong>
                  <span>Notify reviewers automatically when high-confidence duplicate records are imported.</span>
                </div>
                <label className="settings-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="settings-slider" />
                </label>
              </div>
            </div>
          )}

          {section === "Security" && (
            <div className="settings-list">
              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Two-Factor Authentication (2FA)</strong>
                  <span>Require a TOTP verification code from an authenticator app when signing in.</span>
                </div>
                <span className="settings-profile-badge">
                  <CheckCircle2 size={13} /> Enabled
                </span>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Change password</strong>
                  <span>Last updated 42 days ago. Minimum 12 characters with symbols and numerals.</span>
                </div>
                <button className="settings-btn-outline" type="button">
                  <KeyRound size={14} /> Update password
                </button>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Current active session</strong>
                  <span>macOS Chrome • Phnom Penh, Cambodia • IP: 10.20.4.18 (Current)</span>
                </div>
                <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 600 }}>Active now</span>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Session idle timeout</strong>
                  <span>Automatically log out when inactive to protect sensitive registry records.</span>
                </div>
                <select defaultValue="30" style={{ width: "160px", height: "42px", borderRadius: "8px", padding: "0 10px", fontSize: "13.5px" }}>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
            </div>
          )}

          {section === "Language" && (
            <div className="settings-list">
              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>System interface language</strong>
                  <span>Select the primary display language for navigation menus, alerts and tables.</span>
                </div>
                <select defaultValue="en" style={{ width: "180px", height: "42px", borderRadius: "8px", padding: "0 10px", fontSize: "13.5px" }}>
                  <option value="en">English (US)</option>
                  <option value="km">ភាសាខ្មែរ (Khmer)</option>
                </select>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Khmer font family</strong>
                  <span>Preferred font used for rendering Khmer consonants, vowels and diacritics.</span>
                </div>
                <select defaultValue="kantumruy" style={{ width: "220px", height: "42px", borderRadius: "8px", padding: "0 10px", fontSize: "13.5px" }}>
                  <option value="kantumruy">Kantumruy Pro (Modern Sans)</option>
                  <option value="battambang">Battambang (Traditional)</option>
                  <option value="siemreap">Siemreap (Condensed)</option>
                </select>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Numeral display format</strong>
                  <span>Format numbers and record IDs using Western Arabic or Khmer script numerals.</span>
                </div>
                <select defaultValue="latin" style={{ width: "200px", height: "42px", borderRadius: "8px", padding: "0 10px", fontSize: "13.5px" }}>
                  <option value="latin">Western Arabic (1, 2, 3)</option>
                  <option value="khmer">Khmer Numerals (១, ២, ៣)</option>
                </select>
              </div>
            </div>
          )}

          {section === "Appearance" && (
            <div className="settings-list">
              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Color theme mode</strong>
                  <span>Choose between clean light mode or comfortable dark mode for low-light environments.</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="settings-btn-outline" type="button">
                    <Sun size={15} /> Light
                  </button>
                  <button className="settings-btn-outline" type="button">
                    <Moon size={15} /> Dark
                  </button>
                </div>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>High contrast table borders</strong>
                  <span>Increase border definitions and contrast for record tables and comparison diffs.</span>
                </div>
                <label className="settings-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="settings-slider" />
                </label>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Compact table density</strong>
                  <span>Reduce row padding to display more records simultaneously on large monitors.</span>
                </div>
                <label className="settings-switch">
                  <input type="checkbox" />
                  <span className="settings-slider" />
                </label>
              </div>
            </div>
          )}

          {section === "Notifications" && (
            <div className="settings-list">
              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Duplicate match alerts</strong>
                  <span>Receive immediate email notifications when duplicate identity confidence exceeds 95%.</span>
                </div>
                <label className="settings-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="settings-slider" />
                </label>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Daily matching summary digest</strong>
                  <span>Receive an automated daily email report summarizing comparison volumes and accuracy.</span>
                </div>
                <label className="settings-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="settings-slider" />
                </label>
              </div>

              <div className="settings-list-item">
                <div className="settings-list-item-info">
                  <strong>Security & audit events</strong>
                  <span>Alert on sensitive administrative actions such as role modifications and bulk exports.</span>
                </div>
                <label className="settings-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="settings-slider" />
                </label>
              </div>
            </div>
          )}

          <div className="settings-footer-actions">
            {saved && (
              <span className="settings-save-toast">
                <CheckCircle2 size={16} /> Preferences saved successfully
              </span>
            )}
            <button className="settings-btn-outline" type="button">
              Discard
            </button>
            <Button onClick={handleSave}>
              <Check size={16} /> Save preferences
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}

