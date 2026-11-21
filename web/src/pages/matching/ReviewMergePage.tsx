import { useState } from "react";
import { AlertCircle, ArrowLeftRight, Check, CheckCircle2, ChevronDown, History, Merge, ShieldCheck } from "lucide-react";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

export default function ReviewMerge() {
  const [merged, setMerged] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [selections, setSelections] = useState<Record<string, "a" | "b">>({
    name: "b",
    dob: "b",
    phone: "a",
    province: "b",
    document: "b",
  });
  const fields = [
    { id: "name", label: "Full name", a: "សុខ ដារ៉ា", b: "Sok Dara", match: true, khmer: true },
    { id: "dob", label: "Date of birth", a: "12 March 1992", b: "12 March 1992", match: true },
    { id: "phone", label: "Phone", a: "+855 12 345 678", b: "+855 12 345 687", match: false },
    { id: "province", label: "Province", a: "Phnom Penh", b: "Phnom Penh", match: true },
    { id: "document", label: "Document ID", a: "KH-09184276", b: "KH-09184276", match: true },
  ];

  const chooseValue = (field: string, source: "a" | "b") => {
    setSelections((current) => ({ ...current, [field]: source }));
    setMerged(false);
  };

  return (
    <div className="manual-review-page">
      <PageHeader
        title="Review & Merge"
        description="Compare both records carefully and choose the authoritative values."
      >
        <span className="review-case-pill">Case KID-008421 · Pending</span>
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
        <section className="card review-compare-card" aria-label="Record comparison">
          <div className="review-record-headings">
            <div className="review-record-spacer" aria-hidden="true" />
            <div className="review-record-heading">
              <span className="record-label">RECORD A</span>
              <div className="profile-title">
                <div className="profile-avatar khmer">សដ</div>
                <div>
                  <strong className="khmer">សុខ ដារ៉ា</strong>
                  <span>Created 14 Feb 2024</span>
                </div>
              </div>
            </div>
            <div className="review-record-heading">
              <span className="record-label">RECORD B</span>
              <div className="profile-title">
                <div className="profile-avatar">SD</div>
                <div>
                  <strong>Sok Dara</strong>
                  <span>Imported 22 May 2024</span>
                </div>
              </div>
            </div>
          </div>
          <div className="review-fields">
            {fields.map((field) => (
              <div className="review-field-row" key={field.id}>
                <div className="review-field-meta">
                  <strong>{field.label}</strong>
                  <span className={`review-match-pill ${field.match ? "is-match" : "is-conflict"}`}>
                    {field.match ? "Match" : "Conflict"}
                  </span>
                </div>
                <label className={`review-value-choice ${selections[field.id] === "a" ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name={field.id}
                    checked={selections[field.id] === "a"}
                    onChange={() => chooseValue(field.id, "a")}
                  />
                  <span className={field.khmer ? "khmer" : ""}>{field.a}</span>
                </label>
                <label className={`review-value-choice ${selections[field.id] === "b" ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name={field.id}
                    checked={selections[field.id] === "b"}
                    onChange={() => chooseValue(field.id, "b")}
                  />
                  <span>{field.b}</span>
                </label>
              </div>
            ))}
          </div>
        </section>
        <aside className="card review-decision-panel" aria-label="Match summary and decision">
          <div className="review-score" aria-label="96 percent match confidence">
            96<span>%</span>
          </div>
          <div className="review-signal-list">
            <span>
              <Check size={18} /> Name phonetics
            </span>
            <span>
              <Check size={18} /> Date of birth
            </span>
            <span>
              <Check size={18} /> Document ID
            </span>
            <span className="conflict">
              <AlertCircle size={18} /> Phone conflict
            </span>
          </div>
          <div className="review-divider" />
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
            disabled={!confirmed || merged}
          >
            <Merge size={16} /> Merge selected values
          </Button>
          <p className="review-preserve-note">
            <ShieldCheck size={18} />
            <span>Both source records will be preserved in the audit history.</span>
          </p>
        </aside>
      </div>
    </div>
  );
}

