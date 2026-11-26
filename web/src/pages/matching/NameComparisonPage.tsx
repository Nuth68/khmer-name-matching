import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Info,
} from "lucide-react";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import {
  compareNames,
  type NameSimilarityResult,
} from "../../utils/nameSimilarity";

const variantKindLabels = {
  "mock-reference": "Mock reference",
  "spelling-candidate": "Spelling candidate",
  "spacing-candidate": "Spacing candidate",
  "name-order-candidate": "Name-order candidate",
};

export default function NameComparison() {
  const [compared, setCompared] = useState(false);
  const [left, setLeft] = useState("សុខ ដារ៉ា");
  const [right, setRight] = useState("Sokh Dara");
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [comparison, setComparison] = useState<NameSimilarityResult | null>(
    null,
  );
  const [isComparing, setIsComparing] = useState(false);
  const [apiError, setApiError] = useState("");
  const requestController = useRef<AbortController | null>(null);

  useEffect(
    () => () => requestController.current?.abort(),
    [],
  );

  const clearComparison = () => {
    requestController.current?.abort();
    requestController.current = null;
    setCompared(false);
    setComparison(null);
    setIsComparing(false);
    setApiError("");
    setCopied(false);
  };

  const runComparison = async (firstName: string, secondName: string) => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setCompared(true);
    setComparison(null);
    setIsComparing(true);
    setApiError("");
    setCopied(false);

    try {
      const result = await compareNames(
        firstName,
        secondName,
        controller.signal,
      );
      if (!controller.signal.aborted) {
        setComparison(result);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setApiError(
          error instanceof Error
            ? error.message
            : "The similarity API request failed.",
        );
      }
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
        setIsComparing(false);
      }
    }
  };

  const handleSwap = () => {
    setLeft(right);
    setRight(left);
    void runComparison(right, left);
  };

  const handleCopy = () => {
    const score =
      comparison && comparison.score !== null
        ? `${comparison.score}%`
        : "unavailable";
    void navigator.clipboard.writeText(
      `Match Report: ${left} ↔ ${right} | ${score} baseline similarity (review required)`,
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
                onChange={(e) => {
                  setLeft(e.target.value);
                  clearComparison();
                }}
                className="nc-input is-khmer"
                placeholder="បញ្ចូលឈ្មោះជាភាសាខ្មែរ..."
              />
              {left && (
                <button
                  type="button"
                  className="nc-input-clear"
                  onClick={() => {
                    setLeft("");
                    clearComparison();
                  }}
                  aria-label="Clear first name"
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
                onChange={(e) => {
                  setRight(e.target.value);
                  clearComparison();
                }}
                className="nc-input"
                placeholder="Enter Latin name..."
              />
              {right && (
                <button
                  type="button"
                  className="nc-input-clear"
                  onClick={() => {
                    setRight("");
                    clearComparison();
                  }}
                  aria-label="Clear second name"
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
            onClick={() => void runComparison(left, right)}
            disabled={!left.trim() || !right.trim() || isComparing}
            className="nc-submit-btn"
          >
            {isComparing ? "Comparing…" : "Compare Names"}
          </button>
        </div>
      </section>

      {apiError && (
        <p className="nc-api-error" role="alert">
          Python similarity API error: {apiError} Start the local backend and
          try again.
        </p>
      )}

      {/* Comparison Results */}
      {compared && !apiError && (
        <>
          {/* Comparison Result Card */}
          <section className="nc-card">
            <div className="nc-card-header">
              <h2 className="nc-card-title">Comparison Result</h2>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!comparison || isComparing}
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
            <div className="nc-result-sub">
              {isComparing
                ? "Waiting for Python similarity API"
                : comparison?.method === "dictionary-assisted"
                ? "Dictionary-assisted Levenshtein baseline"
                : comparison?.method === "levenshtein"
                ? "Normalized character-level Levenshtein baseline"
                : "Baseline unavailable for this cross-script pair"}
            </div>

            <div className="nc-result-score-row">
              <span className="nc-result-score">
                {isComparing
                  ? "..."
                  : comparison && comparison.score !== null
                  ? `${comparison.score}%`
                  : "N/A"}
              </span>
              <span className="nc-badge-review">
                {isComparing
                  ? "Comparing"
                  : comparison && comparison.score !== null
                  ? "Review required"
                  : "No score"}
              </span>
            </div>

            {comparison && comparison.score !== null ? (
              <div className="nc-result-bar-box">
                <ProgressBar
                  labelPosition="none"
                  min={0}
                  max={100}
                  value={comparison.score}
                  color="primary"
                />
              </div>
            ) : isComparing ? (
              <p className="nc-result-sub" aria-live="polite">
                Comparing names with the Python service…
              </p>
            ) : (
              <p className="nc-result-sub">
                Add an exact Khmer dictionary entry or compare names in the
                same script.
              </p>
            )}

            <div className="nc-result-footer">
              <span className="nc-result-disclaimer">
                {isComparing
                  ? "Waiting for the local Python backend."
                  : comparison && comparison.distance !== null
                  ? `${comparison.distance} edit(s) over ${comparison.maxLength} Unicode code points. Baseline only; not identity verification.`
                  : "No score is produced without a cross-script dictionary entry."}
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
                {isComparing ? (
                  <div className="nc-explanation-item is-info">
                    <Info size={17} className="nc-icon-info" />
                    <span>Waiting for the local Python comparison service.</span>
                  </div>
                ) : comparison && comparison.score !== null ? (
                  <>
                    <div className="nc-explanation-item">
                      <CheckCircle2 size={17} className="nc-icon-check" />
                      <span>
                        Compared using NFC, case normalization, and collapsed
                        whitespace
                      </span>
                    </div>
                    <div className="nc-explanation-item">
                      <CheckCircle2 size={17} className="nc-icon-check" />
                      <span>
                        Levenshtein distance: {comparison.distance} edit(s)
                        across {comparison.maxLength} Unicode code points
                      </span>
                    </div>
                    {comparison.matchedVariant && comparison.variantType && (
                      <div className="nc-explanation-item is-info">
                        <Info size={17} className="nc-icon-info" />
                        <span>
                          Best dictionary candidate: “
                          {comparison.matchedVariant}” (
                          {variantKindLabels[comparison.variantType]}). Verify
                          it before using it as an alias.
                        </span>
                      </div>
                    )}
                    <div className="nc-explanation-item is-info">
                      <Info size={17} className="nc-icon-info" />
                      <span>{comparison.explanation}</span>
                    </div>
                    <div className="nc-explanation-item is-info">
                      <Info size={17} className="nc-icon-info" />
                      <span>
                        This baseline is not phonetic and cannot confirm a
                        person's identity.
                      </span>
                    </div>
                  </>
                ) : comparison ? (
                  <>
                    <div className="nc-explanation-item is-info">
                      <Info size={17} className="nc-icon-info" />
                      <span>{comparison.explanation}</span>
                    </div>
                  </>
                ) : null}
              </div>
            </section>
          )}

          {/* Breakdown & Variants Columns */}
          <div className="nc-columns-grid">
            <section className="nc-card">
              <h2 className="nc-card-title">Baseline breakdown</h2>
              <div className="nc-breakdown-list">
                {comparison && comparison.score !== null ? (
                  <div className="nc-breakdown-item">
                    <div className="nc-breakdown-info">
                      <strong>Normalized Levenshtein</strong>
                      <span>
                        · {comparison.distance} edit(s) / {comparison.maxLength}{" "}
                        code points
                      </span>
                    </div>
                    <ProgressBar
                      labelPosition="right"
                      min={0}
                      max={100}
                      value={comparison.score}
                      color="primary"
                    />
                  </div>
                ) : isComparing ? (
                  <p className="nc-result-sub">Waiting for the Python API…</p>
                ) : (
                  <p className="nc-result-sub">
                    No score is available until a cross-script dictionary entry
                    is added.
                  </p>
                )}
              </div>
            </section>

            <section className="nc-card">
              <h2 className="nc-card-title">Romanisation variants</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {comparison?.dictionaryEntry ? (
                  comparison.dictionaryEntry.variants.map((variant) => (
                    <div
                      key={variant.latin}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "10px",
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
                          {variant.latin}
                        </strong>
                        <span
                          style={{
                            fontSize: "11.5px",
                            color: "var(--muted, #64748b)",
                          }}
                        >
                          {variant.note}
                        </span>
                      </div>
                      <span
                        style={{
                          flexShrink: 0,
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "11.5px",
                          fontWeight: 550,
                          backgroundColor:
                            variant.kind === "mock-reference"
                              ? "#eff6ff"
                              : "#fff7ed",
                          color:
                            variant.kind === "mock-reference"
                              ? "#1d4ed8"
                              : "#9a3412",
                        }}
                      >
                        {variantKindLabels[variant.kind]}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="nc-result-sub">
                    No exact dictionary entry is available for this comparison.
                  </p>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
