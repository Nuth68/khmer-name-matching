import { useState } from "react";
import {
  ArrowLeftRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Info,
} from "lucide-react";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";

export default function NameComparison() {
  const [compared, setCompared] = useState(true);
  const [left, setLeft] = useState("សុខ ដារ៉ា");
  const [right, setRight] = useState("Sokh Dara");
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const handleSwap = () => {
    setLeft(right);
    setRight(left);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Match Report: ${left} ↔ ${right} | 94% Similarity (Review recommended)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="nc-page">
      {/* Header */}
      <div className="nc-header">
        <div className="nc-header-title">
          <h1>Name Comparison</h1>
        </div>
      </div>

      {/* Compare Names Card */}
      <section className="nc-card">
        <h2 className="nc-card-title">Compare Names</h2>

        <div className="nc-inputs-grid">
          <div className="nc-input-group">
            <label>First name</label>
            <div className="nc-input-wrapper">
              <input
                type="text"
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                className="nc-input is-khmer"
                placeholder="បញ្ចូលឈ្មោះជាភាសាខ្មែរ..."
              />
              {left && (
                <button
                  type="button"
                  className="nc-input-clear"
                  onClick={() => setLeft("")}
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
            <span className="nc-input-tag">Khmer detected</span>
          </div>

          <div className="nc-input-group">
            <label>Second name</label>
            <div className="nc-input-wrapper">
              <input
                type="text"
                value={right}
                onChange={(e) => setRight(e.target.value)}
                className="nc-input"
                placeholder="Enter Latin name..."
              />
              {right && (
                <button
                  type="button"
                  className="nc-input-clear"
                  onClick={() => setRight("")}
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
            <span className="nc-input-tag">Latin detected</span>
          </div>
        </div>

        <div className="nc-actions-row">
          <button
            type="button"
            onClick={handleSwap}
            className="nc-swap-btn"
            title="Swap names (⇄)"
            aria-label="Swap names"
          >
            <ArrowLeftRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => setCompared(true)}
            disabled={!left.trim() || !right.trim()}
            className="nc-submit-btn"
          >
            Compare Names
          </button>
        </div>
      </section>

      {/* Comparison Results */}
      {compared && (
        <>
          {/* Comparison Result Card */}
          <section className="nc-card">
            <div className="nc-card-header">
              <h2 className="nc-card-title">Comparison Result</h2>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  background: "transparent",
                  border: 0,
                  color: "var(--primary)",
                  fontSize: "12px",
                  fontWeight: 550,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy report"}
              </button>
            </div>
            <div className="nc-result-sub">Illustrative similarity score</div>

            <div className="nc-result-score-row">
              <span className="nc-result-score">94%</span>
              <span className="nc-badge-review">Review recommended</span>
            </div>

            <div className="nc-result-bar-box">
              <ProgressBar
                labelPosition="none"
                min={0}
                max={100}
                value={94}
                color="primary"
              />
            </div>

            <div className="nc-result-footer">
              <span className="nc-result-disclaimer">
                Example only — not a verified matching result.
              </span>
              <button
                type="button"
                onClick={() => setShowExplanation((prev) => !prev)}
                className="nc-toggle-btn"
                style={{
                  transform: showExplanation ? "rotate(180deg)" : "none",
                }}
                title="Toggle explanation"
                aria-label="Toggle explanation"
              >
                <ChevronDown size={15} />
              </button>
            </div>
          </section>

          {/* Matching Explanation Card */}
          {showExplanation && (
            <section className="nc-card">
              <h2 className="nc-card-title">Matching Explanation</h2>
              <div className="nc-explanation-list">
                <div className="nc-explanation-item">
                  <CheckCircle2 size={17} className="nc-icon-check" />
                  <span>Possible romanisation variant detected</span>
                </div>
                <div className="nc-explanation-item">
                  <CheckCircle2 size={17} className="nc-icon-check" />
                  <span>Similar name tokens</span>
                </div>
                <div className="nc-explanation-item is-info">
                  <Info size={17} className="nc-icon-info" />
                  <span>Additional identity fields are needed to confirm a person</span>
                </div>
              </div>
            </section>
          )}

          {/* Breakdown & Variants Columns */}
          <div className="nc-columns-grid">
            {/* Match breakdown with ProgressBar */}
            <section className="nc-card">
              <h2 className="nc-card-title">Match breakdown</h2>
              <div className="nc-breakdown-list">
                {[
                  {
                    label: "Romanisation match",
                    note: "Standard UNGEGN transliteration",
                    score: 98,
                  },
                  {
                    label: "Phonetic similarity",
                    note: "IPA sound correlation /sok daːraː/",
                    score: 96,
                  },
                  {
                    label: "Character alignment",
                    note: "7 of 8 graphemes aligned",
                    score: 92,
                  },
                  {
                    label: "Keyboard proximity",
                    note: "Zero adjacent-key typos detected",
                    score: 99,
                  },
                ].map((item) => (
                  <div key={item.label} className="nc-breakdown-item">
                    <div className="nc-breakdown-info">
                      <strong>{item.label}</strong>
                      <span>· {item.note}</span>
                    </div>
                    <ProgressBar
                      labelPosition="right"
                      min={0}
                      max={100}
                      value={item.score}
                      color="primary"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Romanisation variants */}
            <section className="nc-card">
              <h2 className="nc-card-title">Romanisation variants</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  {
                    name: "Sok Dara",
                    type: "Exact",
                    desc: "Official UNGEGN Romanisation",
                    bg: "#ecfdf5",
                    color: "#065f46",
                    border: "#a7f3d0",
                  },
                  {
                    name: "Sokh Dara",
                    type: "Common",
                    desc: "Colloquial Khmer variation",
                    bg: "#eaf7f3",
                    color: "#277962",
                    border: "#b7dfd3",
                  },
                  {
                    name: "Sok Darra",
                    type: "Possible",
                    desc: "Alternative double-r spelling",
                    bg: "#f8fafc",
                    color: "#475569",
                    border: "#e2e8f0",
                  },
                  {
                    name: "Dara Sok",
                    type: "Reversed",
                    desc: "Western given + family order",
                    bg: "#f8fafc",
                    color: "#475569",
                    border: "#e2e8f0",
                  },
                ].map((v) => (
                  <div
                    key={v.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border, #e2e8f0)",
                      background: "var(--surface-subtle, #f8fafc)",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          display: "block",
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "var(--text, #0f172a)",
                        }}
                      >
                        {v.name}
                      </strong>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "var(--muted, #64748b)",
                        }}
                      >
                        {v.desc}
                      </span>
                    </div>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "999px",
                        fontSize: "11.5px",
                        fontWeight: 550,
                        backgroundColor: v.bg,
                        color: v.color,
                        border: `1px solid ${v.border}`,
                      }}
                    >
                      {v.type}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
