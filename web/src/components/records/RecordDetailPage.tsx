import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  Download,
  Fingerprint,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import type { IdentityRecord } from "./RecordsPage";

type Props = {
  record: IdentityRecord;
  onBack: () => void;
  onUpdateRecord?: (updated: IdentityRecord) => void;
};

export default function RecordDetailPage({ record, onBack, onUpdateRecord }: Props) {
  const [currentRecord, setCurrentRecord] = useState<IdentityRecord>(record);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const markVerified = () => {
    const updated = { ...currentRecord, status: "Verified" as const, accuracy: 99.2 };
    setCurrentRecord(updated);
    onUpdateRecord?.(updated);
    showToast(`Record ${currentRecord.id} successfully marked as Verified.`);
  };

  const avatarLetters = currentRecord.khmer.slice(0, 2);

  return (
    <div className="record-detail-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <button className="btn btn-secondary" onClick={onBack} type="button">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>

        <div className="page-actions">
          <button
            className="btn btn-secondary"
            onClick={() => copyToClipboard(JSON.stringify(currentRecord, null, 2), "Dossier JSON")}
            type="button"
          >
            <Download size={16} />
            <span>Export dossier</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
            type="button"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
          {currentRecord.status !== "Verified" ? (
            <button className="btn btn-primary" onClick={markVerified} type="button">
              <UserCheck size={16} />
              <span>Mark as Verified</span>
            </button>
          ) : (
            <button className="btn btn-primary verified-disabled" disabled type="button">
              <CheckCircle2 size={16} />
              <span>Verified Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner Card */}
      <section className="card record-hero-card">
        <div className="hero-avatar-box">
          <div className="profile-avatar-circle large">{avatarLetters}</div>
        </div>

        <div className="hero-info-box">
          <div className="hero-primary-names">
            <h2 className="khmer-hero-name">{currentRecord.khmer}</h2>
            <span className="latin-hero-name">{currentRecord.latin}</span>
            <span
              className={`record-status-pill ${
                currentRecord.status === "Verified"
                  ? "pill-verified"
                  : currentRecord.status === "Review"
                    ? "pill-review"
                    : "pill-incomplete"
              }`}
            >
              <i className="status-dot" />
              <span>{currentRecord.status === "Review" ? "Needs Review" : currentRecord.status}</span>
            </span>
          </div>

          <div className="hero-chips-row">
            <div className="hero-chip">
              <Fingerprint size={15} />
              <span>{currentRecord.docType}: <b>{currentRecord.docId}</b></span>
            </div>
            <div className="hero-chip">
              <Calendar size={15} />
              <span>DOB: <b>{currentRecord.dob}</b></span>
            </div>
            <div className="hero-chip">
              <MapPin size={15} />
              <span>Province: <b>{currentRecord.province}</b></span>
            </div>
            <div className="hero-chip">
              <Phone size={15} />
              <span>Phone: <b>{currentRecord.phone}</b></span>
            </div>
          </div>
        </div>

        <div className="hero-score-badge">
          <span className="score-label">MATCH ACCURACY</span>
          <div className="score-num">
            {currentRecord.accuracy}
            <span>%</span>
          </div>
          <span className="score-pill">
            <ShieldCheck size={13} /> High confidence
          </span>
        </div>
      </section>

      {/* Grid of 4 Detail Cards */}
      <div className="record-sections-grid">
        {/* Card 1: Civil Credentials */}
        <section className="card detail-section-card">
          <div className="section-head-row">
            <div className="section-head-title">
              <User size={18} />
              <h3>Civil Identity & Credentials</h3>
            </div>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(currentRecord.docId, "Document ID")}
              title="Copy Document ID"
              type="button"
            >
              {copiedField === "Document ID" ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedField === "Document ID" ? "Copied" : "Copy ID"}</span>
            </button>
          </div>

          <div className="section-kv-grid">
            <div className="kv-box">
              <span className="kv-label">Khmer Full Name (ឈ្មោះពេញ)</span>
              <span className="kv-value khmer">{currentRecord.khmer}</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Latin Full Name</span>
              <span className="kv-value">{currentRecord.latin}</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Document Number</span>
              <span className="kv-value mono">{currentRecord.docId}</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Document Type</span>
              <span className="kv-value">{currentRecord.docType} (Biometric)</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Date of Birth</span>
              <span className="kv-value">{currentRecord.dob}</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Gender</span>
              <span className="kv-value">{currentRecord.gender}</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Nationality</span>
              <span className="kv-value">Cambodian (ខ្មែរ)</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Place of Origin</span>
              <span className="kv-value">{currentRecord.province}</span>
            </div>
          </div>
        </section>

        {/* Card 2: Contact & Residential Info */}
        <section className="card detail-section-card">
          <div className="section-head-row">
            <div className="section-head-title">
              <MapPin size={18} />
              <h3>Contact & Residence</h3>
            </div>
          </div>

          <div className="section-kv-grid">
            <div className="kv-box">
              <span className="kv-label">Primary Phone</span>
              <span className="kv-value mono">{currentRecord.phone}</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Alternate Phone</span>
              <span className="kv-value mono">+855 12 883 194</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Province / Municipality</span>
              <span className="kv-value">{currentRecord.province}</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">District / Khan</span>
              <span className="kv-value">Central District</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Commune / Sangkat</span>
              <span className="kv-value">Prek Preah</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Residence Status</span>
              <span className="kv-value">Permanent Citizen</span>
            </div>
            <div className="kv-box full-span">
              <span className="kv-label">Full Address</span>
              <span className="kv-value">House 42, Street 184, {currentRecord.province}, Cambodia</span>
            </div>
          </div>
        </section>

        {/* Card 3: Quality & Matching Engine */}
        <section className="card detail-section-card">
          <div className="section-head-row">
            <div className="section-head-title">
              <Database size={18} />
              <h3>Data Quality & Matching Status</h3>
            </div>
          </div>

          <div className="section-kv-grid">
            <div className="kv-box">
              <span className="kv-label">Primary Data Source</span>
              <span className="kv-value">{currentRecord.source}</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Cross-Database Matches</span>
              <span className="kv-value match-confirmed">
                <CheckCircle2 size={15} /> 3 Registries Confirmed
              </span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Phonetic Algorithm</span>
              <span className="kv-value">Khmer Multi-Tier Hybrid (IPA)</span>
            </div>
            <div className="kv-box">
              <span className="kv-label">Duplicate Scan Risk</span>
              <span className="kv-value text-success">
                <ShieldCheck size={15} /> Clean (0 Duplicates)
              </span>
            </div>
            <div className="kv-box full-span">
              <span className="kv-label">Validation Summary</span>
              <span className="kv-value">
                Biographic details match official National Civil Registry standards. No keyboard errors or phonetic discrepancies detected.
              </span>
            </div>
          </div>
        </section>

        {/* Card 4: Audit Trail & Timeline */}
        <section className="card detail-section-card">
          <div className="section-head-row">
            <div className="section-head-title">
              <Clock size={18} />
              <h3>Audit Trail & Timeline</h3>
            </div>
          </div>

          <div className="detail-timeline">
            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <strong>Record created</strong>
                <span>Imported from Civil Registry bulk database file</span>
                <time>{currentRecord.createdAt}, 09:15 AM</time>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <strong>Automated Romanisation generated</strong>
                <span>Script mapped: {currentRecord.khmer} ➔ {currentRecord.latin}</span>
                <time>{currentRecord.createdAt}, 09:16 AM</time>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <strong>Cross-Registry Matching Scan</strong>
                <span>Evaluated across 128,642 identities with {currentRecord.accuracy}% confidence</span>
                <time>22 May 2024, 02:40 PM</time>
              </div>
            </div>

            <div className="timeline-item">
              <div className={`timeline-dot ${currentRecord.status === "Verified" ? "verified" : ""}`} />
              <div className="timeline-content">
                <strong>
                  {currentRecord.status === "Verified" ? "Identity Verified" : "Pending Verification Review"}
                </strong>
                <span>
                  {currentRecord.status === "Verified"
                    ? "Confirmed by Administrator (Chenda Sok)"
                    : "Awaiting final review confirmation"}
                </span>
                <time>Today, 10:45 AM</time>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="dash-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
