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

const keyboardRows = [
  ["ឮ", "ឆ", "ឹ", "េ", "រ", "ត", "យ", "ុ", "ិ", "ោ", "ផ"],
  ["ា", "ស", "ដ", "ថ", "ង", "ហ", "្", "ក", "ល", "ើ"],
  ["ឋ", "ខ", "ច", "វ", "ប", "ន", "ម", "ំ", "។"],
];

export default function KeyboardDetection() {
  const [accepted, setAccepted] = useState(false);
  const [input, setInput] = useState("សុខ ដារា");
  return (
    <>
      <PageHeader
        title="Keyboard Error Detection"
        description="Detect likely Khmer keyboard entry errors and review suggested corrections."
      >
        <Button variant="secondary">
          <History size={16} /> Correction history
        </Button>
      </PageHeader>
      <div className="workspace-grid">
        <section className="card detection-input">
          <div className="card-head">
            <div>
              <h2>Check a name</h2>
              <p>Enter the name exactly as it was received.</p>
            </div>
            <Badge tone="blue">Khmer detected</Badge>
          </div>
          <div className="field-group">
            <label>Original name</label>
            <textarea
              className="khmer large-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setAccepted(false);
              }}
            />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label>Keyboard layout</label>
              <button className="select-control">
                Khmer NiDA <ChevronDown size={15} />
              </button>
            </div>
            <div className="field-group">
              <label>Sensitivity</label>
              <button className="select-control">
                Balanced <ChevronDown size={15} />
              </button>
            </div>
          </div>
          <Button className="full-btn">
            <Zap size={16} /> Analyze typing errors
          </Button>
          <div className="privacy-callout">
            <ShieldCheck size={17} />
            <span>
              <strong>Human confirmation required</strong> K-ID never overwrites an official name
              automatically.
            </span>
          </div>
        </section>
        <section className="card correction-card">
          <div className="card-head">
            <div>
              <h2>Suggested correction</h2>
              <p>1 likely typing error found</p>
            </div>
            <Badge tone={accepted ? "success" : "warning"}>
              {accepted ? "Accepted" : "Review required"}
            </Badge>
          </div>
          <div className="correction-comparison">
            <div>
              <span>ORIGINAL</span>
              <strong className="khmer">
                សុខ ដារ<span className="wrong-char">ា</span>
              </strong>
            </div>
            <ArrowRight size={20} />
            <div>
              <span>SUGGESTED</span>
              <strong className="khmer">
                សុខ ដារ<span className="correct-char">៉ា</span>
              </strong>
            </div>
          </div>
          <div className="confidence">
            <div>
              <span>Correction confidence</span>
              <strong>94%</strong>
            </div>
            <div className="progress-track">
              <i style={{ width: "94%" }} />
            </div>
          </div>
          <div className="explanation">
            <AlertCircle size={18} />
            <div>
              <strong>Adjacent key sequence detected</strong>
              <p>
                The diacritic “៉” may have been omitted. This is common when typing quickly using the
                Khmer NiDA layout.
              </p>
            </div>
          </div>
          <div className="correction-actions">
            <Button variant="secondary" onClick={() => setAccepted(false)}>
              <X size={16} /> Reject
            </Button>
            <Button
              onClick={() => {
                setAccepted(true);
                setInput("សុខ ដារ៉ា");
              }}
            >
              <Check size={16} /> Accept correction
            </Button>
          </div>
        </section>
      </div>
      <section className="card keyboard-panel">
        <div className="card-head">
          <div>
            <h2>Keyboard visualization</h2>
            <p>The likely missed key is highlighted below.</p>
          </div>
          <div className="keyboard-legend">
            <span>
              <i className="key-dot current" /> Typed key
            </span>
            <span>
              <i className="key-dot suggested" /> Suggested key
            </span>
          </div>
        </div>
        <div className="keyboard-keys">
          {keyboardRows.map((row, i) => (
            <div className="key-row" key={i}>
              {row.map((k) => (
                <span
                  className={`key ${k === "ា" ? "typed" : ""} ${k === "្" ? "suggested-key" : ""}`}
                  key={k}
                >
                  {k}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
