import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users,
  X,
  Zap,
} from "lucide-react";

type Props = {
  onNavigate?: (route: string) => void;
};

type ImportHistoryItem = {
  id: string;
  filename: string;
  records: number;
  validRecords: number;
  duplicates: number;
  date: string;
  status: "Completed" | "Issues found" | "Processing";
  operator: string;
  size: string;
};

const initialHistory: ImportHistoryItem[] = [
  {
    id: "IMP-8491",
    filename: "citizen_registry_may.csv",
    records: 2480,
    validRecords: 2468,
    duplicates: 12,
    date: "22 May 2025, 10:45 AM",
    status: "Completed",
    operator: "Chenda Sok",
    size: "1.8 MB",
  },
  {
    id: "IMP-8490",
    filename: "province_updates.xlsx",
    records: 814,
    validRecords: 810,
    duplicates: 4,
    date: "18 May 2025, 03:20 PM",
    status: "Completed",
    operator: "Dara Vann",
    size: "640 KB",
  },
  {
    id: "IMP-8489",
    filename: "manual_review.json",
    records: 126,
    validRecords: 112,
    duplicates: 14,
    date: "12 May 2025, 09:15 AM",
    status: "Issues found",
    operator: "Sreypich Ly",
    size: "95 KB",
  },
  {
    id: "IMP-8488",
    filename: "civil_status_q1.csv",
    records: 5200,
    validRecords: 5188,
    duplicates: 12,
    date: "04 May 2025, 04:30 PM",
    status: "Completed",
    operator: "Chenda Sok",
    size: "3.9 MB",
  },
];

export default function ImportExportPage({ onNavigate }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    records: number;
  } | null>(null);
  const [history, setHistory] = useState<ImportHistoryItem[]>(initialHistory);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx" | "json">("csv");
  const [exportScope, setExportScope] = useState<"all" | "verified" | "review">("all");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectSample = () => {
    setSelectedFile({
      name: "cambodia_civil_registry_sample_2025.csv",
      size: "1.9 MB",
      records: 2480,
    });
    showToast("Loaded sample dataset: 2,480 citizen records");
  };

  const downloadTemplate = () => {
    const csvContent =
      "full_name_kh,full_name_en,id_card_no,birth_date,gender,phone,province\n" +
      "សុខ ដារ៉ា,Sok Dara,091842761,1992-03-12,Male,+855 12 345 678,Phnom Penh\n" +
      "ចាន់ សុភា,Chan Sophea,N1429810,1988-11-04,Female,+855 96 782 104,Battambang\n" +
      "លី ស្រីពេជ្រ,Ly Sreypich,CR-88214,1995-07-21,Female,+855 10 443 821,Siem Reap\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "k-id-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("CSV Template downloaded.");
  };

  const handleExecuteExport = () => {
    const filename = `k-id-export-${exportScope}-${Date.now()}.${exportFormat}`;
    showToast(`Exported ${exportScope.toUpperCase()} records as ${filename}`);
    setShowExportModal(false);
  };

  const handleConfirmImport = () => {
    if (!selectedFile) return;
    const newEntry: ImportHistoryItem = {
      id: `IMP-${Math.floor(1000 + Math.random() * 9000)}`,
      filename: selectedFile.name,
      records: selectedFile.records,
      validRecords: selectedFile.records - 12,
      duplicates: 12,
      date: "Just now",
      status: "Completed",
      operator: "Chenda Sok",
      size: selectedFile.size,
    };
    setHistory([newEntry, ...history]);
    setStep(4);
    showToast(`Successfully imported ${selectedFile.records.toLocaleString()} records!`);
  };

  return (
    <div className="import-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Import Data</h1>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={downloadTemplate} type="button">
            <FileSpreadsheet size={16} />
            <span>Download template (.CSV)</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowExportModal(true)}
            type="button"
          >
            <Download size={16} />
            <span>Export data</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="import-stats-grid">
        <article className="card import-stat-card">
          <div className="import-stat-head">
            <span>Total Processed Records</span>
            <div className="stat-icon-wrap primary">
              <Database size={16} />
            </div>
          </div>
          <strong>142,850</strong>
          <small className="stat-foot-note positive">
            <CheckCircle2 size={12} /> Across 28 import batches
          </small>
        </article>

        <article className="card import-stat-card">
          <div className="import-stat-head">
            <span>Validation Success Rate</span>
            <div className="stat-icon-wrap success">
              <ShieldCheck size={16} />
            </div>
          </div>
          <strong>99.4%</strong>
          <small className="stat-foot-note positive">
            <span>2,468 / 2,480 valid rows</span>
          </small>
        </article>

        <article className="card import-stat-card">
          <div className="import-stat-head">
            <span>Duplicates Flagged</span>
            <div className="stat-icon-wrap warning">
              <Zap size={16} />
            </div>
          </div>
          <strong>1,284</strong>
          <small className="stat-foot-note">
            <span>Routed to manual review</span>
          </small>
        </article>

        <article className="card import-stat-card">
          <div className="import-stat-head">
            <span>Supported Schemas</span>
            <div className="stat-icon-wrap info">
              <FileText size={16} />
            </div>
          </div>
          <strong>CSV, XLSX, JSON</strong>
          <small className="stat-foot-note">
            <span>Automatic column mapping</span>
          </small>
        </article>
      </div>

      {/* Modern Stepper Bar */}
      <div className="card import-stepper-card">
        <div className="import-stepper">
          {[
            { num: 1, label: "Upload File", desc: "Select source dataset" },
            { num: 2, label: "Map Columns", desc: "Align schema fields" },
            { num: 3, label: "Validate & Scan", desc: "Check duplicates & errors" },
            { num: 4, label: "Import Complete", desc: "Indexed into database" },
          ].map((st) => {
            const isDone = step > st.num;
            const isCurrent = step === st.num;
            return (
              <div
                key={st.num}
                className={`step-item ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}`}
                onClick={() => {
                  if (st.num < step || (st.num === 2 && selectedFile)) {
                    setStep(st.num as any);
                  }
                }}
              >
                <div className="step-circle">
                  {isDone ? <Check size={14} strokeWidth={2.5} /> : st.num}
                </div>
                <div className="step-label-box">
                  <strong>{st.label}</strong>
                  <span>{st.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Workspace Card */}
      <section className="card import-workspace-card">
        {/* Step 1: Upload Dropzone */}
        {step === 1 && (
          <div className="step-content">
            {!selectedFile ? (
              <div className="upload-dropzone">
                <div className="dropzone-icon">
                  <UploadCloud size={38} />
                </div>
                <h3>Upload identity records dataset</h3>
                <p>Drag and drop your spreadsheet file here, or browse files on your computer.</p>

                <div className="dropzone-actions">
                  <label className="btn btn-primary dropzone-browse-label">
                    <UploadCloud size={16} />
                    <span>Browse files</span>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.json"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile({
                            name: file.name,
                            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                            records: 2480,
                          });
                          showToast(`Selected ${file.name}`);
                        }
                      }}
                    />
                  </label>

                  <button className="btn btn-secondary" onClick={handleSelectSample} type="button">
                    <Sparkles size={16} />
                    <span>Try with sample dataset (2,480 records)</span>
                  </button>
                </div>

                <div className="dropzone-footer">
                  <span className="format-badge">.CSV</span>
                  <span className="format-badge">.XLSX</span>
                  <span className="format-badge">.JSON</span>
                  <span className="format-limit">Max file size: 100 MB</span>
                </div>
              </div>
            ) : (
              <div className="file-ready-box">
                <div className="file-card-preview">
                  <div className="file-icon-box">
                    <FileSpreadsheet size={32} />
                  </div>
                  <div className="file-info-col">
                    <strong>{selectedFile.name}</strong>
                    <span>
                      {selectedFile.size} · {selectedFile.records.toLocaleString()} detected records
                    </span>
                    <span className="badge-ready">
                      <CheckCircle2 size={13} /> Schema detected successfully
                    </span>
                  </div>
                  <div className="file-actions-col">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedFile(null)}
                      type="button"
                    >
                      Change file
                    </button>
                    <button className="btn btn-primary" onClick={() => setStep(2)} type="button">
                      <span>Proceed to column mapping</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {step === 2 && (
          <div className="step-content">
            <div className="step-head-banner">
              <div>
                <h3>Map Source Columns to Identity Schema</h3>
                <p>
                  We detected <b>8 columns</b> and <b>2,480 rows</b> in{" "}
                  <code>{selectedFile?.name || "dataset.csv"}</code>.
                </p>
              </div>
              <span className="status-badge-green">
                <Check size={14} /> 7 Auto-mapped
              </span>
            </div>

            <div className="mapping-table-wrap">
              <table className="mapping-table">
                <thead>
                  <tr>
                    <th>Source Column in File</th>
                    <th style={{ width: 40 }} />
                    <th>Target Field in K-ID</th>
                    <th>Sample Data Value</th>
                    <th>Match Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["full_name_kh", "Khmer Full Name (ឈ្មោះពេញ)", "សុខ ដារ៉ា", "100% exact"],
                    ["full_name_en", "Latin Full Name", "Sok Dara", "100% exact"],
                    ["id_card_no", "National Document ID", "091842761", "100% exact"],
                    ["birth_date", "Date of Birth", "1992-03-12", "99% date format"],
                    ["gender", "Gender", "Male", "100% exact"],
                    ["phone_number", "Phone Number", "+855 12 345 678", "98% normalized"],
                    ["province", "Province / Municipality", "Phnom Penh", "100% exact"],
                  ].map(([src, trg, sample, conf]) => (
                    <tr key={src}>
                      <td>
                        <span className="source-col-tag">{src}</span>
                      </td>
                      <td style={{ textAlign: "center", color: "#94a3b8" }}>
                        <ArrowRight size={15} />
                      </td>
                      <td>
                        <div className="target-select-btn">
                          <CheckCircle2 size={15} className="text-success" />
                          <span>{trg}</span>
                        </div>
                      </td>
                      <td>
                        <span className="sample-val-text">{sample}</span>
                      </td>
                      <td>
                        <span className="badge-conf">
                          <Check size={12} /> {conf}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="step-footer-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)} type="button">
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(3)} type="button">
                <span>Run Validation & Scan</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Validation & Duplicates */}
        {step === 3 && (
          <div className="step-content">
            <div className="step-head-banner">
              <div>
                <h3>Dataset Pre-Validation & Duplicate Analysis</h3>
                <p>Scanned 2,480 rows against existing identity records and romanisation rules.</p>
              </div>
              <span className="status-badge-green">
                <Check size={14} /> Clean Scan
              </span>
            </div>

            <div className="validation-grid">
              <div className="val-box val-success">
                <div className="val-icon">
                  <CheckCircle2 size={24} />
                </div>
                <div className="val-meta">
                  <strong>2,468 Records</strong>
                  <span>100% Valid & Ready for Indexing</span>
                </div>
              </div>

              <div className="val-box val-warning">
                <div className="val-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="val-meta">
                  <strong>12 Minor Warnings</strong>
                  <span>Phone format normalized automatically</span>
                </div>
              </div>

              <div className="val-box val-info">
                <div className="val-icon">
                  <Zap size={24} />
                </div>
                <div className="val-meta">
                  <strong>14 Potential Duplicates</strong>
                  <span>Flagged for comparison review</span>
                </div>
              </div>
            </div>

            <div className="validation-preview-card">
              <h4>Sample Validated Records Ready for Import</h4>
              <div className="mini-preview-table-wrap">
                <table className="mini-preview-table">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Khmer Name</th>
                      <th>Latin Name</th>
                      <th>Document ID</th>
                      <th>DOB</th>
                      <th>Validation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["#1", "សុខ ដារ៉ា", "Sok Dara", "091842761", "12 Mar 1992", "Valid"],
                      ["#2", "ចាន់ សុភា", "Chan Sophea", "N1429810", "04 Nov 1988", "Valid"],
                      ["#3", "លី ស្រីពេជ្រ", "Ly Sreypich", "CR-88214", "21 Jul 1995", "Valid"],
                    ].map(([row, kh, en, id, dob, status]) => (
                      <tr key={row}>
                        <td>
                          <code>{row}</code>
                        </td>
                        <td>
                          <b className="khmer">{kh}</b>
                        </td>
                        <td>{en}</td>
                        <td>
                          <code>{id}</code>
                        </td>
                        <td>{dob}</td>
                        <td>
                          <span className="badge-ready">
                            <Check size={12} /> {status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="step-footer-actions">
              <button className="btn btn-secondary" onClick={() => setStep(2)} type="button">
                Back
              </button>
              <button className="btn btn-primary" onClick={handleConfirmImport} type="button">
                <CheckCircle2 size={16} />
                <span>Confirm & Import 2,480 Records</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Import Complete */}
        {step === 4 && (
          <div className="step-content step-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} />
            </div>
            <h2>Dataset Imported Successfully!</h2>
            <p>
              <b>2,480 identity records</b> from <code>{selectedFile?.name || "dataset.csv"}</code>{" "}
              have been indexed into the K-ID identity matching engine.
            </p>

            <div className="import-success-stats">
              <div>
                <strong>2,468</strong>
                <span>New Records Indexed</span>
              </div>
              <div>
                <strong>12</strong>
                <span>Duplicates Flagged</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Schema Coverage</span>
              </div>
            </div>

            <div className="step-success-actions">
              <button
                className="btn btn-primary"
                onClick={() => onNavigate?.("All Records")}
                type="button"
              >
                <Users size={16} />
                <span>View in All Records</span>
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedFile(null);
                  setStep(1);
                }}
                type="button"
              >
                <Plus size={16} />
                <span>Import Another Dataset</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Recent Imports History Section */}
      <section className="card import-history-card">
        <div className="history-head-row">
          <div>
            <h3>Recent Imports History</h3>
            <p>Audit trail of all dataset imports processed by your organization</p>
          </div>
          <span className="badge-count">{history.length} batches</span>
        </div>

        <div className="table-scroll">
          <table className="history-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Records Processed</th>
                <th>Validation Ratio</th>
                <th>Processed At</th>
                <th>Operator</th>
                <th>Status</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="file-name-cell">
                      <FileSpreadsheet size={17} className="file-icon" />
                      <div>
                        <strong>{item.filename}</strong>
                        <span>
                          {item.size} · {item.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{item.records.toLocaleString()}</strong> rows
                  </td>
                  <td>
                    <span className="valid-ratio-pill">
                      {Math.round((item.validRecords / item.records) * 100)}% valid
                    </span>
                  </td>
                  <td className="text-muted">{item.date}</td>
                  <td className="text-muted">{item.operator}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        item.status === "Completed" ? "pill-completed" : "pill-issues"
                      }`}
                    >
                      <i className="status-dot" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td>
                    <button className="row-action-btn" title="More options" type="button">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-backdrop" onClick={() => setShowExportModal(false)}>
          <div
            className="export-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="dialog-header">
              <div>
                <h2>Export Identity Records</h2>
                <p>Download citizen records dataset in your preferred format.</p>
              </div>
              <button
                className="dialog-close-btn"
                onClick={() => setShowExportModal(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="export-dialog-body">
              <div className="export-field-group">
                <label className="field-group-label">Choose Export Format</label>
                <div className="format-options-grid">
                  {[
                    { id: "csv", label: "CSV Spreadsheet", ext: ".csv" },
                    { id: "xlsx", label: "Excel Workbook", ext: ".xlsx" },
                    { id: "json", label: "JSON Data", ext: ".json" },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      className={`format-option-btn ${exportFormat === fmt.id ? "active" : ""}`}
                      onClick={() => setExportFormat(fmt.id as any)}
                    >
                      <FileSpreadsheet size={20} />
                      <strong>{fmt.label}</strong>
                      <small>{fmt.ext}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="export-field-group">
                <label className="field-group-label">Record Scope</label>
                <div className="scope-radios">
                  <label>
                    <input
                      type="radio"
                      name="scope"
                      checked={exportScope === "all"}
                      onChange={() => setExportScope("all")}
                    />
                    <span>All Records (128,642 records)</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="scope"
                      checked={exportScope === "verified"}
                      onChange={() => setExportScope("verified")}
                    />
                    <span>Verified Records Only (119,830 records)</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="scope"
                      checked={exportScope === "review"}
                      onChange={() => setExportScope("review")}
                    />
                    <span>Needs Review Only (1,284 records)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="dialog-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowExportModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleExecuteExport} type="button">
                <Download size={16} />
                <span>Download Export File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Banner */}
      {toastMessage && (
        <div className="dash-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
