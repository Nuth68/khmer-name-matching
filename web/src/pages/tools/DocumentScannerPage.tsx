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

export default function DocumentScanner() {
  const [uploaded, setUploaded] = useState(false);
  return (
    <>
      <PageHeader
        title="Document Scanner"
        description="Extract and verify identity information from Cambodian documents."
      >
        <Button variant="secondary">
          <History size={16} /> Scan history
        </Button>
      </PageHeader>
      <div className="scanner-grid">
        <section className="card upload-panel">
          <div
            className={`drop-zone ${uploaded ? "uploaded" : ""}`}
            onClick={() => setUploaded(true)}
          >
            <div className="upload-icon">
              {uploaded ? <CheckCircle2 size={26} /> : <UploadCloud size={26} />}
            </div>
            <strong>{uploaded ? "cambodian_id_sample.jpg" : "Drop a document here"}</strong>
            <span>
              {uploaded ? "1.8 MB · Ready to process" : "or click to browse from your computer"}
            </span>
            {!uploaded && <Badge>JPG, PNG or PDF · Max 10 MB</Badge>}
          </div>
          <div className="privacy-callout">
            <ShieldCheck size={17} />
            <span>
              Documents are encrypted during processing and are never used to train models.
            </span>
          </div>
        </section>
        <section className="card extracted-panel">
          <div className="card-head">
            <div>
              <h2>Extracted information</h2>
              <p>Review all fields before saving.</p>
            </div>
            <Badge tone={uploaded ? "success" : "neutral"}>
              {uploaded ? "98% confidence" : "Awaiting document"}
            </Badge>
          </div>
          {uploaded ? (
            <div className="extracted-fields">
              {[
                ["Khmer name", "សុខ ដារ៉ា"],
                ["Latin name", "SOK DARA"],
                ["Date of birth", "12 MAR 1992"],
                ["Document number", "KH09184276"],
              ].map(([l, v]) => (
                <label key={l}>
                  <span>{l}</span>
                  <input className={l === "Khmer name" ? "khmer" : ""} defaultValue={v} />
                </label>
              ))}
              <Button className="full-btn">
                <Search size={16} /> Find matching identities
              </Button>
            </div>
          ) : (
            <div className="empty-state">
              <ScanLine size={34} />
              <strong>No document scanned</strong>
              <span>Upload a clear image to extract identity data.</span>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
