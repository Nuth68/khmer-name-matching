import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Merge,
  ShieldCheck,
} from "lucide-react";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";

type Source = "a" | "b";
type FieldStatus = "same" | "variant" | "conflict";

interface ReviewField {
  id: string;
  label: string;
  a: string;
  b: string;
  status: FieldStatus;
  hint?: string;
  khmerA?: boolean;
  khmerB?: boolean;
}

const FIELDS: ReviewField[] = [
  {
    id: "name",
    label: "Full name",
    a: "សុខ ដារ៉ា",
    b: "Sok Dara",
    status: "variant",
    hint: "Same name in different scripts",
    khmerA: true,
  },
  { id: "dob", label: "Date of birth", a: "12 March 1992", b: "12 March 1992", status: "same" },
  {
    id: "phone",
    label: "Phone",
    a: "+855 12 345 678",
    b: "+855 12 345 687",
    status: "conflict",
    hint: "Last two digits differ",
  },
  { id: "province", label: "Province", a: "Phnom Penh", b: "Phnom Penh", status: "same" },
  { id: "document", label: "Document ID", a: "KH-09184276", b: "KH-09184276", status: "same" },
];

const STATUS_LABEL: Record<FieldStatus, string> = {
  same: "Same",
  variant: "Variant",
  conflict: "Conflict",
};

const SIGNALS = [
  { label: "Name phonetics", ok: true },
  { label: "Date of birth", ok: true },
  { label: "Document ID", ok: true },
  { label: "Phone number", ok: false },
];

const SCORE = 96;

export default function ReviewMerge() {
  const [merged, setMerged] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  // Only fields that differ need a decision. Conflicts start unanswered so the reviewer must choose.
  const [selections, setSelections] = useState<Record<string, Source | undefined>>({
    name: "a",
    phone: undefined,
  });

  const decisionFields = FIELDS.filter((field) => field.status !== "same");
  const pending = decisionFields.filter((field) => !selections[field.id]);
  const sameCount = FIELDS.length - decisionFields.length;
  const canMerge = confirmed && pending.length === 0 && !merged;

  const chooseValue = (field: string, source: Source) => {
    setSelections((current) => ({ ...current, [field]: source }));
    setMerged(false);
  };

  const mergedValue = (field: ReviewField) => {
    if (field.status === "same") return { value: field.a, khmer: field.khmerA };
    const source = selections[field.id];
    if (!source) return null;
    return source === "a"
      ? { value: field.a, khmer: field.khmerA }
      : { value: field.b, khmer: field.khmerB };
  };

  const blockedReason =
    pending.length > 0
      ? `Choose a value for ${pending.map((field) => field.label.toLowerCase()).join(", ")}.`
      : !confirmed
        ? "Tick the confirmation to continue."
        : null;

  return (
    <div className="manual-review-page">
      <PageHeader
        title="Review & Merge"
        description="These two records look like the same person. Resolve the differences, then merge."
      >
        <span className="review-case-pill">
          <span className="review-case-dot" aria-hidden="true" />
          Case KID-008421 · Pending
        </span>
      </PageHeader>

      {merged && (
        <div className="success-banner review-success" role="status">
          <CheckCircle2 size={19} />
          <div>
            <strong>Records merged successfully</strong>
            <span>The originals remain available in Identity History.</span>
          </div>
        </div>
      )}

      <div className="review-workspace">
        <section className="review-compare-card" aria-label="Record comparison">
          <header className="review-card-head">
            <div>
              <h2>Compare fields</h2>
              <p>
                {sameCount} identical · {decisionFields.length} need your choice
              </p>
            </div>
            <div className="review-legend" aria-hidden="true">
              <span><i className="dot same" /> Same</span>
              <span><i className="dot variant" /> Variant</span>
              <span><i className="dot conflict" /> Conflict</span>
            </div>
          </header>

          <div className="review-grid review-grid-head">
            <div className="review-col-label">Field</div>
            <RecordHeading tag="A" initials="សដ" name="សុខ ដារ៉ា" meta="Created 14 Feb 2024" khmer />
            <RecordHeading tag="B" initials="SD" name="Sok Dara" meta="Imported 22 May 2024" />
          </div>

          <div className="review-rows">
            {FIELDS.map((field) => {
              const selected = selections[field.id];
              const needsChoice = field.status !== "same" && !selected;
              return (
                <div
                  key={field.id}
                  className={`review-grid review-row is-${field.status} ${needsChoice ? "needs-choice" : ""}`}
                  role={field.status === "same" ? undefined : "radiogroup"}
                  aria-label={field.status === "same" ? undefined : `Choose ${field.label}`}
                >
                  <div className="review-field-meta">
                    <strong>{field.label}</strong>
                    <span className={`review-status is-${field.status}`}>
                      {field.status === "same" && <Check size={12} strokeWidth={3} />}
                      {field.status === "variant" && <AlertTriangle size={12} strokeWidth={2.5} />}
                      {field.status === "conflict" && <AlertCircle size={12} strokeWidth={2.5} />}
                      {STATUS_LABEL[field.status]}
                    </span>
                  </div>

                  {field.status === "same" ? (
                    <div className="review-same-value">
                      <span className={field.khmerA ? "khmer" : ""}>{field.a}</span>
                      <small>Identical in both records</small>
                    </div>
                  ) : (
                    <>
                      {(["a", "b"] as Source[]).map((source) => {
                        const value = source === "a" ? field.a : field.b;
                        const khmer = source === "a" ? field.khmerA : field.khmerB;
                        const isSelected = selected === source;
                        return (
                          <label
                            key={source}
                            className={`review-choice ${isSelected ? "is-selected" : ""}`}
                          >
                            <input
                              type="radio"
                              name={field.id}
                              checked={isSelected}
                              onChange={() => chooseValue(field.id, source)}
                            />
                            <span className="review-choice-body">
                              <span className={`review-choice-value ${khmer ? "khmer" : ""}`}>
                                {value}
                              </span>
                              <small>
                                {isSelected ? "Keep this value" : `From record ${source.toUpperCase()}`}
                              </small>
                            </span>
                            {isSelected && <Check size={16} strokeWidth={2.5} className="review-choice-check" />}
                          </label>
                        );
                      })}
                      {field.hint && (
                        <p className="review-row-hint">
                          {needsChoice ? <strong>Choose one · </strong> : null}
                          {field.hint}
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="review-decision-panel" aria-label="Match summary and decision">
          <div className="review-panel-section">
            <span className="review-panel-label">Match confidence</span>
            <div className="review-score-line">
              <div className="review-score" aria-label={`${SCORE} percent match confidence`}>
                {SCORE}<span>%</span>
              </div>
              <span className="review-score-badge">High</span>
            </div>
            <div className="review-meter" aria-hidden="true">
              <span style={{ width: `${SCORE}%` }} />
            </div>
            <ul className="review-signal-list">
              {SIGNALS.map((signal) => (
                <li key={signal.label} className={signal.ok ? "ok" : "conflict"}>
                  {signal.ok ? <Check size={15} strokeWidth={2.5} /> : <AlertCircle size={15} />}
                  <span>{signal.label}</span>
                  <em>{signal.ok ? "Match" : "Differs"}</em>
                </li>
              ))}
            </ul>
          </div>

          <div className="review-panel-section">
            <span className="review-panel-label">Merged record preview</span>
            <dl className="review-preview">
              {FIELDS.map((field) => {
                const result = mergedValue(field);
                return (
                  <div key={field.id}>
                    <dt>{field.label}</dt>
                    <dd className={result ? (result.khmer ? "khmer" : "") : "is-pending"}>
                      {result ? result.value : "Not chosen"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <div className="review-panel-section review-panel-actions">
            <label className="review-confirm-check">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => {
                  setConfirmed(event.target.checked);
                  setMerged(false);
                }}
              />
              <span>I confirm these records belong to the same person.</span>
            </label>
            <Button
              className="full-btn review-merge-button"
              onClick={() => setMerged(true)}
              disabled={!canMerge}
            >
              <Merge size={16} /> Merge records
            </Button>
            {blockedReason && !merged && <p className="review-blocked">{blockedReason}</p>}
            <p className="review-preserve-note">
              <ShieldCheck size={16} />
              <span>Both source records are kept in the audit history.</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RecordHeading({
  tag,
  initials,
  name,
  meta,
  khmer,
}: {
  tag: string;
  initials: string;
  name: string;
  meta: string;
  khmer?: boolean;
}) {
  return (
    <div className="review-record-heading">
      <div className={`review-avatar ${khmer ? "khmer" : ""}`}>{initials}</div>
      <div className="review-record-text">
        <span className="review-record-tag">Record {tag}</span>
        <strong className={khmer ? "khmer" : ""}>{name}</strong>
        <small>{meta}</small>
      </div>
    </div>
  );
}
