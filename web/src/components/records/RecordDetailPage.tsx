import { useState } from "react";
import {
  Check,
  CheckCircle2,
  CircleAlert,
  Clock,
  Edit3,
  X,
} from "lucide-react";
import type { IdentityRecord } from "./RecordsPage";

type Props = {
  record: IdentityRecord;
  onBack: () => void;
  onUpdateRecord?: (updated: IdentityRecord) => void;
};

export default function RecordDetailPage({ record, onBack, onUpdateRecord }: Props) {
  const [currentRecord, setCurrentRecord] = useState<IdentityRecord>(record);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const updated: IdentityRecord = {
      ...currentRecord,
      khmer: (form.elements.namedItem("khmer") as HTMLInputElement).value || currentRecord.khmer,
      latin: (form.elements.namedItem("latin") as HTMLInputElement).value || currentRecord.latin,
      dob: (form.elements.namedItem("dob") as HTMLInputElement).value || currentRecord.dob,
      gender:
        ((form.elements.namedItem("gender") as HTMLSelectElement).value as any) ||
        currentRecord.gender,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value || currentRecord.phone,
      province:
        (form.elements.namedItem("province") as HTMLInputElement).value || currentRecord.province,
      docId: (form.elements.namedItem("docId") as HTMLInputElement).value || currentRecord.docId,
      status:
        ((form.elements.namedItem("status") as HTMLSelectElement).value as any) ||
        currentRecord.status,
    };
    setCurrentRecord(updated);
    onUpdateRecord?.(updated);
    setIsEditing(false);
    showToast(`Record ${updated.id} updated successfully.`);
  };

  return (
    <div className="dossier-full-page">
      {/* Header Bar */}
      <div className="dossier-header-bar">
        <div className="dossier-header-left">
          <h1 className="dossier-title">Citizen Identity Dossier</h1>
          <span className="dossier-id">{currentRecord.id}</span>
        </div>
        <div className="dossier-header-actions">
          <button
            className="dossier-icon-btn"
            onClick={() => setIsEditing(true)}
            title="Edit record"
            type="button"
          >
            <Edit3 size={18} />
          </button>
          <button
            className="dossier-icon-btn close"
            onClick={onBack}
            title="Close"
            type="button"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Top Profile Card */}
      <section className="dossier-profile-card">
        <div className="dossier-profile-names">
          <h2 className="dossier-khmer-name">{currentRecord.khmer}</h2>
          <span className="dossier-latin-name">{currentRecord.latin}</span>
        </div>
        <div>
          <span
            className={`record-status-pill ${
              currentRecord.status === "Verified"
                ? "pill-verified"
                : currentRecord.status === "Review"
                  ? "pill-review"
                  : "pill-incomplete"
            }`}
          >
            {currentRecord.status === "Verified" && <CheckCircle2 size={14} />}
            {currentRecord.status === "Review" && <Clock size={14} />}
            {currentRecord.status === "Incomplete" && <CircleAlert size={14} />}
            <span>{currentRecord.status === "Review" ? "Needs review" : currentRecord.status}</span>
          </span>
        </div>
      </section>

      {/* Details Card */}
      <section className="dossier-details-card">
        <div className="dossier-grid">
          <div className="dossier-grid-item">
            <span className="dossier-grid-label">RECORD ID</span>
            <span className="dossier-grid-value mono">{currentRecord.id}</span>
          </div>

          <div className="dossier-grid-item">
            <span className="dossier-grid-label">STATUS</span>
            <span className="dossier-grid-value">{currentRecord.status}</span>
          </div>

          <div className="dossier-grid-item">
            <span className="dossier-grid-label">DATE OF BIRTH</span>
            <span className="dossier-grid-value">{currentRecord.dob}</span>
          </div>

          <div className="dossier-grid-item">
            <span className="dossier-grid-label">GENDER</span>
            <span className="dossier-grid-value">{currentRecord.gender}</span>
          </div>

          <div className="dossier-grid-item">
            <span className="dossier-grid-label">PHONE NUMBER</span>
            <span className="dossier-grid-value mono">{currentRecord.phone}</span>
          </div>

          <div className="dossier-grid-item">
            <span className="dossier-grid-label">PROVINCE</span>
            <span className="dossier-grid-value">{currentRecord.province}</span>
          </div>

          <div className="dossier-grid-item">
            <span className="dossier-grid-label">NATIONAL DOC ID</span>
            <span className="dossier-grid-value">
              {currentRecord.docId} ({currentRecord.docType})
            </span>
          </div>

          <div className="dossier-grid-item">
            <span className="dossier-grid-label">SYSTEM SOURCE</span>
            <span className="dossier-grid-value">{currentRecord.source}</span>
          </div>

          <div className="dossier-grid-item">
            <span className="dossier-grid-label">MATCHING ACCURACY</span>
            <span className="dossier-grid-value accuracy">
              <CheckCircle2 size={15} />
              {currentRecord.accuracy}% Confidence
            </span>
          </div>

          <div className="dossier-grid-item">
            <span className="dossier-grid-label">CREATED AT</span>
            <span className="dossier-grid-value">{currentRecord.createdAt}</span>
          </div>
        </div>
      </section>

      {/* Edit Record Modal */}
      {isEditing && (
        <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
          <div
            className="form-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h2>Edit Identity Record</h2>
                <p>Modify official credentials for {currentRecord.id}.</p>
              </div>
              <button onClick={() => setIsEditing(false)} aria-label="Close" type="button">
                <X size={18} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSaveEdit}>
              <label>
                <span>Khmer full name (ឈ្មោះពេញ)</span>
                <input name="khmer" defaultValue={currentRecord.khmer} required />
              </label>
              <label>
                <span>Latin full name</span>
                <input name="latin" defaultValue={currentRecord.latin} required />
              </label>
              <label>
                <span>Date of birth</span>
                <input name="dob" defaultValue={currentRecord.dob} required />
              </label>
              <label>
                <span>Gender</span>
                <select name="gender" defaultValue={currentRecord.gender}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </label>
              <label>
                <span>Phone number</span>
                <input name="phone" defaultValue={currentRecord.phone} required />
              </label>
              <label>
                <span>Province / Municipality</span>
                <input name="province" defaultValue={currentRecord.province} required />
              </label>
              <label>
                <span>National Document ID</span>
                <input name="docId" defaultValue={currentRecord.docId} required />
              </label>
              <label>
                <span>Status</span>
                <select name="status" defaultValue={currentRecord.status}>
                  <option value="Verified">Verified</option>
                  <option value="Review">Review</option>
                  <option value="Incomplete">Incomplete</option>
                </select>
              </label>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  <CheckCircle2 size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
