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

const romanisationExamples = [
  { khmer: "សុខ ដារ៉ា", latin: "Sok Dara" },
  { khmer: "សុខា", latin: "Sokha" },
  { khmer: "វណ្ណា", latin: "Vanna" },
];

const normalizationRules = [
  {
    title: "Use Unicode NFC",
    detail:
      "Normalize canonically equivalent text to NFC before comparison. Do not use NFKC.",
  },
  {
    title: "Preserve Khmer spelling",
    detail:
      "Keep vowels, diacritics, and other Khmer marks. Do not strip marks or rewrite character order by hand.",
  },
  {
    title: "Keep coeng sequences intact",
    detail:
      "Preserve U+17D2 COENG and its following consonant; do not replace subscript sequences with lookalike characters.",
  },
  {
    title: "Normalize spacing for matching only",
    detail:
      "Trim leading/trailing whitespace and collapse repeated whitespace in the comparison key. Retain the original value for display.",
  },
];

function getComparisonKey(value: string) {
  return value.normalize("NFC").trim().replace(/\s+/gu, " ");
}

export default function RomanisationPage() {
  const [source, setSource] = useState(romanisationExamples[0].khmer);
  const [copied, setCopied] = useState(false);
  const selectedExample = romanisationExamples.find(
    (example) => getComparisonKey(example.khmer) === getComparisonKey(source),
  );

  function selectExample(example: (typeof romanisationExamples)[number]) {
    setSource(example.khmer);
    setCopied(false);
  }

  return (
    <>
      <PageHeader
        title="Khmer Romanisation"
        description="Review Khmer Unicode matching rules and common Latin name spellings"
      >
        <Button variant="secondary">
          <History size={16} /> History
        </Button>
      </PageHeader>
      <section className="card conversion-workspace">
        <div className="conversion-toolbar">
          <div>
            <button className="active">Khmer</button>
            <span aria-hidden="true">→</span>
            <button>Latin</button>
          </div>
          <button type="button">
            Common name spellings <ChevronDown size={14} />
          </button>
        </div>
        <div className="conversion-panels">
          <div>
            <label>
              KHMER INPUT <Badge tone="blue">Khmer</Badge>
            </label>
            <textarea
              className="khmer"
              value={source}
              onChange={(event) => {
                setSource(event.target.value);
                setCopied(false);
              }}
            />
            <span>{source.length} characters</span>
            <p className="normalization-preview">
              Comparison key (NFC):{" "}
              <b className="khmer">{getComparisonKey(source) || "—"}</b>
            </p>
          </div>
          <div>
            <label>
              REFERENCE LATIN SPELLING{" "}
              <Badge tone={selectedExample ? "success" : "neutral"}>
                {selectedExample ? "Example" : "No example"}
              </Badge>
            </label>
            <div className="conversion-output">
              {selectedExample?.latin ?? "No matching example"}
            </div>
            <button
              type="button"
              disabled={!selectedExample}
              onClick={() => setCopied(true)}
            >
              <Copy size={15} /> {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </section>
      <section className="card romanisation-reference">
        <div className="romanisation-section-heading">
          <div>
            <h2>Khmer Unicode normalization rules</h2>
            <p>Apply these rules to comparison keys; preserve the source name.</p>
          </div>
          <Badge tone="blue">Draft v1</Badge>
        </div>
        <div className="normalization-rule-grid">
          {normalizationRules.map((rule) => (
            <article className="normalization-rule" key={rule.title}>
              <CheckCircle2 size={17} />
              <div>
                <strong>{rule.title}</strong>
                <p>{rule.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="romanisation-caveat">
          <Info size={17} />
          <p>
            NFC handles Unicode canonical equivalence; it does not make every
            visually similar or historically variant Khmer spelling identical.
            Keep those variants separate unless reviewed as an explicit alias.
          </p>
        </div>
      </section>
      <section className="card romanisation-reference">
        <div className="romanisation-section-heading">
          <div>
            <h2>Starter romanisation examples</h2>
            <p>
              Common reference spellings, not a claim that one Latin form is
              uniquely determined by the Khmer text.
            </p>
          </div>
          <Badge>5 examples</Badge>
        </div>
        <div className="romanisation-examples">
          <div className="romanisation-example-row romanisation-example-header">
            <span>KHMER</span>
            <span>COMMON LATIN SPELLING</span>
            <span />
          </div>
          {romanisationExamples.map((example) => (
            <div className="romanisation-example-row" key={example.khmer}>
              <span className="khmer">{example.khmer}</span>
              <span>{example.latin}</span>
              <button type="button" onClick={() => selectExample(example)}>
                Use example
              </button>
            </div>
          ))}
        </div>
        <p className="romanisation-footnote">
          Personal preference, official documents, and transliteration standards
          may use different spellings. Confirm a person’s recorded spelling when
          available.
        </p>
      </section>
    </>
  );
}
