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

export default function PhoneticMatchingPage() {
  return (
    <>
      <PageHeader
        title="Phonetic Matching"
        description="Compare how Khmer and Latin names sound across writing systems"
      >
        <Button variant="secondary">
          <History size={16} /> Match history
        </Button>
      </PageHeader>
      <section className="card phonetic-workspace">
        <div className="phonetic-inputs">
          <label>
            <span>
              NAME A <Badge tone="blue">Khmer</Badge>
            </span>
            <input className="khmer" defaultValue="សុខ ដារ៉ា" />
            <small>Pronunciation: /sok daːraː/</small>
          </label>
          <div className="phonetic-connector">
            <Activity size={20} />
          </div>
          <label>
            <span>
              NAME B <Badge>Latin</Badge>
            </span>
            <input defaultValue="Sok Dara" />
            <small>Pronunciation: /sɒk dɑːrə/</small>
          </label>
        </div>
        <div className="phonetic-result">
          <div>
            <span>PHONETIC SIMILARITY</span>
            <strong>96%</strong>
            <Badge tone="success">Strong phonetic match</Badge>
          </div>
          <div className="phoneme-track">
            {[
              ["សុ", "so", true],
              ["ខ", "k", true],
              ["ដា", "da", true],
              ["រ៉ា", "ra", true],
            ].map(([khmer, latin, match]) => (
              <span className={match ? "match" : ""} key={khmer as string}>
                <b className="khmer">{khmer}</b>
                <i />
                <b>{latin}</b>
              </span>
            ))}
          </div>
        </div>
      </section>
      <div className="tool-detail-grid">
        <section className="card tool-detail-card">
          <h2>Sound alignment</h2>
          <div className="breakdown-row">
            <div>
              <strong>Initial consonants</strong>
              <span>/s/ and /s/</span>
            </div>
            <div className="mini-bar">
              <i style={{ width: "100%" }} />
            </div>
            <b>100%</b>
          </div>
          <div className="breakdown-row">
            <div>
              <strong>Vowel sequence</strong>
              <span>/o aː aː/</span>
            </div>
            <div className="mini-bar">
              <i style={{ width: "94%" }} />
            </div>
            <b>94%</b>
          </div>
        </section>
        <section className="card tool-detail-card">
          <h2>Explanation</h2>
          <div className="note-row">
            <CheckCircle2 size={17} />
            <div>
              <strong>Equivalent pronunciation</strong>
              <span>The Latin spelling preserves all significant Khmer phonemes.</span>
            </div>
          </div>
          <div className="note-row">
            <Info size={17} />
            <div>
              <strong>Minor vowel variation</strong>
              <span>The final vowel may vary slightly across regional pronunciation.</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

