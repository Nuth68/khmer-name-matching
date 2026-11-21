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

export default function RomanisationPage() {
  const [source, setSource] = useState("សុខ ដារ៉ា");
  const [copied, setCopied] = useState(false);
  return (
    <>
      <PageHeader
        title="Khmer Romanisation"
        description="Convert Khmer names into consistent Latin spellings"
      >
        <Button variant="secondary">
          <History size={16} /> History
        </Button>
      </PageHeader>
      <section className="card conversion-workspace">
        <div className="conversion-toolbar">
          <div>
            <button className="active">Khmer</button>
            <ArrowRight size={15} />
            <button>Latin</button>
          </div>
          <button>
            UNGEGN standard <ChevronDown size={14} />
          </button>
        </div>
        <div className="conversion-panels">
          <div>
            <label>
              KHMER INPUT <Badge tone="blue">Khmer detected</Badge>
            </label>
            <textarea
              className="khmer"
              value={source}
              onChange={(event) => setSource(event.target.value)}
            />
            <span>{source.length} characters</span>
          </div>
          <div>
            <label>
              LATIN OUTPUT <Badge tone="success">High confidence</Badge>
            </label>
            <div className="conversion-output">Sok Dara</div>
            <button onClick={() => setCopied(true)}>
              <Copy size={15} /> {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </section>
      <div className="tool-detail-grid">
        <section className="card tool-detail-card">
          <h2>Alternative spellings</h2>
          {["Sok Dara", "Sokh Dara", "Sok Darra"].map((value, index) => (
            <div className="alternative-row" key={value}>
              <span>{value}</span>
              <Badge tone={index === 0 ? "success" : "neutral"}>
                {index === 0 ? "Recommended" : `${92 - index * 4}%`}
              </Badge>
            </div>
          ))}
        </section>
        <section className="card tool-detail-card">
          <h2>Conversion notes</h2>
          <div className="note-row">
            <CheckCircle2 size={17} />
            <div>
              <strong>Standard spelling</strong>
              <span>Matches the selected UNGEGN romanisation rules.</span>
            </div>
          </div>
          <div className="note-row">
            <Info size={17} />
            <div>
              <strong>Name context applied</strong>
              <span>Common Cambodian personal-name patterns informed this result.</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}



