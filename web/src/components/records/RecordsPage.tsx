import { useMemo, useState } from "react";
import SearchInput from "../common/SearchInput";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";

export type IdentityRecord = {
  id: string;
  khmer: string;
  latin: string;
  dob: string;
  gender: "Male" | "Female";
  phone: string;
  province: string;
  docId: string;
  docType: string;
  status: "Verified" | "Review" | "Incomplete";
  source: string;
  createdAt: string;
  accuracy: number;
};

const initialRecords: IdentityRecord[] = [
  {
    id: "KID-10482",
    khmer: "សុខ ដារ៉ា",
    latin: "Sok Dara",
    dob: "12 Mar 1992",
    gender: "Male",
    phone: "+855 12 345 678",
    province: "Phnom Penh",
    docId: "091842761",
    docType: "National ID",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "14 Feb 2024",
    accuracy: 98.4,
  },
  {
    id: "KID-10481",
    khmer: "ចាន់ សុភា",
    latin: "Chan Sophea",
    dob: "04 Nov 1988",
    gender: "Female",
    phone: "+855 96 782 104",
    province: "Battambang",
    docId: "N1429810",
    docType: "Passport",
    status: "Review",
    source: "Immigration Dept",
    createdAt: "22 May 2024",
    accuracy: 91.2,
  },
  {
    id: "KID-10480",
    khmer: "លី ស្រីពេជ្រ",
    latin: "Ly Sreypich",
    dob: "21 Jul 1995",
    gender: "Female",
    phone: "+855 10 443 821",
    province: "Siem Reap",
    docId: "CR-88214",
    docType: "Civil Registry",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "10 Mar 2024",
    accuracy: 99.1,
  },
  {
    id: "KID-10479",
    khmer: "ហេង វណ្ណា",
    latin: "Heng Vanna",
    dob: "09 Jan 1990",
    gender: "Male",
    phone: "+855 77 302 119",
    province: "Kandal",
    docId: "DL-50921",
    docType: "Driver License",
    status: "Incomplete",
    source: "Transport Ministry",
    createdAt: "05 Apr 2024",
    accuracy: 78.5,
  },
  {
    id: "KID-10478",
    khmer: "ជា មករា",
    latin: "Chea Makara",
    dob: "18 Sep 1986",
    gender: "Male",
    phone: "+855 92 861 305",
    province: "Kampong Cham",
    docId: "010839215",
    docType: "National ID",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "18 Jan 2024",
    accuracy: 97.6,
  },
  {
    id: "KID-10477",
    khmer: "គឹម សុវណ្ណ",
    latin: "Kim Sovann",
    dob: "15 Apr 1993",
    gender: "Male",
    phone: "+855 88 519 283",
    province: "Takeo",
    docId: "CR-40291",
    docType: "Civil Registry",
    status: "Review",
    source: "Civil Registry",
    createdAt: "12 May 2024",
    accuracy: 89.4,
  },
  {
    id: "KID-10476",
    khmer: "មាស ចន្ទ្រា",
    latin: "Meas Chantra",
    dob: "28 Dec 1997",
    gender: "Female",
    phone: "+855 78 220 914",
    province: "Kampot",
    docId: "081920472",
    docType: "National ID",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "02 Feb 2024",
    accuracy: 98.9,
  },
  {
    id: "KID-10475",
    khmer: "នាង ស្រីនិច",
    latin: "Neang Sreynich",
    dob: "03 Jun 1994",
    gender: "Female",
    phone: "+855 93 401 829",
    province: "Prey Veng",
    docId: "N1829471",
    docType: "Passport",
    status: "Incomplete",
    source: "Immigration Dept",
    createdAt: "19 Apr 2024",
    accuracy: 74.8,
  },
  {
    id: "KID-10474",
    khmer: "អ៊ុង វិសាល",
    latin: "Ung Visal",
    dob: "22 Oct 1989",
    gender: "Male",
    phone: "+855 11 829 401",
    province: "Phnom Penh",
    docId: "092817263",
    docType: "National ID",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "09 Mar 2024",
    accuracy: 96.7,
  },
  {
    id: "KID-10473",
    khmer: "ពេជ្រ សោភា",
    latin: "Pech Sophea",
    dob: "14 Feb 1996",
    gender: "Female",
    phone: "+855 85 918 273",
    province: "Banteay Meanchey",
    docId: "CR-77291",
    docType: "Civil Registry",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "27 Jan 2024",
    accuracy: 98.1,
  },
];

type SortField = "id" | "khmer" | "latin" | "dob" | "status";

export default function RecordsPage({
  onViewRecord,
}: {
  onViewRecord?: (record: IdentityRecord) => void;
}) {
  const [records, setRecords] = useState<IdentityRecord[]>(initialRecords);
  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"All" | "Verified" | "Review" | "Incomplete">("All");
  const [genderFilter, setGenderFilter] = useState<"All" | "Male" | "Female">("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showColumnsPopover, setShowColumnsPopover] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortAsc, setSortAsc] = useState(false);

  // Column visibility
  const [visibleCols, setVisibleCols] = useState({
    dob: true,
    gender: true,
    phone: true,
    province: true,
    status: true,
  });

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter counts
  const counts = useMemo(() => {
    return {
      all: 128642,
      verified: 119830,
      review: 1284,
      incomplete: 742,
    };
  }, []);

  // Filtered & sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter((row) => {
        // Status tab
        if (statusTab !== "All" && row.status !== statusTab) return false;
        // Gender filter
        if (genderFilter !== "All" && row.gender !== genderFilter) return false;
        // Search query
        if (query.trim()) {
          const q = query.toLowerCase();
          const match =
            row.id.toLowerCase().includes(q) ||
            row.khmer.toLowerCase().includes(q) ||
            row.latin.toLowerCase().includes(q) ||
            row.phone.toLowerCase().includes(q) ||
            row.province.toLowerCase().includes(q) ||
            row.docId.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [records, statusTab, genderFilter, query, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const pageRows = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === pageRows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pageRows.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Khmer Name", "Latin Name", "DOB", "Gender", "Phone", "Province", "Status"];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.khmer,
      r.latin,
      r.dob,
      r.gender,
      r.phone,
      r.province,
      r.status,
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `identity-records-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Records exported to CSV successfully.");
  };

  const handleBulkVerify = () => {
    setRecords((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "Verified" } : r)),
    );
    showToast(`Marked ${selectedIds.length} records as Verified.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setRecords((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    showToast(`Deleted ${selectedIds.length} records.`);
    setSelectedIds([]);
  };

  return (
    <div className="records-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Identity Records</h1>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={exportCSV} type="button">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} type="button">
            <UserPlus size={16} />
            <span>New record</span>
          </button>
        </div>
      </div>

      {/* Main Records Card */}
      <section className="card records-card">
        {/* Toolbar: Search + Filter & Columns buttons */}
        <div className="records-toolbar">
          <div className="records-toolbar-left">
            <SearchInput
              value={query}
              onChange={(val) => {
                setQuery(val);
                setPage(1);
              }}
              placeholder="Search by ID, Khmer or Latin name, phone, province…"
            />
          </div>

          <div className="records-toolbar-right">
            {/* Filter Popover */}
            <div className="records-popover-anchor">
              <button
                className={`btn btn-secondary ${showFilterPopover || genderFilter !== "All" ? "active" : ""}`}
                onClick={() => {
                  setShowFilterPopover(!showFilterPopover);
                  setShowColumnsPopover(false);
                }}
                type="button"
              >
                <Filter size={15} />
                <span>Filter</span>
                {genderFilter !== "All" && <span className="filter-badge">1</span>}
              </button>
              {showFilterPopover && (
                <div className="records-popover">
                  <div className="records-popover-head">
                    <strong>Filter Records</strong>
                    <button onClick={() => setShowFilterPopover(false)} type="button">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="records-popover-body">
                    <label>
                      <span>Gender</span>
                      <select
                        value={genderFilter}
                        onChange={(e) => {
                          setGenderFilter(e.target.value as any);
                          setPage(1);
                        }}
                      >
                        <option value="All">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </label>
                  </div>
                  <div className="records-popover-foot">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setGenderFilter("All")}
                      type="button"
                    >
                      Reset
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowFilterPopover(false)}
                      type="button"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Columns Customizer Popover */}
            <div className="records-popover-anchor">
              <button
                className={`btn btn-secondary ${showColumnsPopover ? "active" : ""}`}
                onClick={() => {
                  setShowColumnsPopover(!showColumnsPopover);
                  setShowFilterPopover(false);
                }}
                type="button"
              >
                <SlidersHorizontal size={15} />
                <span>Columns</span>
              </button>
              {showColumnsPopover && (
                <div className="records-popover columns-popover">
                  <div className="records-popover-head">
                    <strong>Toggle Columns</strong>
                    <button onClick={() => setShowColumnsPopover(false)} type="button">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="records-popover-body checkboxes">
                    <label>
                      <input
                        type="checkbox"
                        checked={visibleCols.dob}
                        onChange={(e) =>
                          setVisibleCols({ ...visibleCols, dob: e.target.checked })
                        }
                      />
                      <span>Date of birth</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={visibleCols.gender}
                        onChange={(e) =>
                          setVisibleCols({ ...visibleCols, gender: e.target.checked })
                        }
                      />
                      <span>Gender</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={visibleCols.phone}
                        onChange={(e) =>
                          setVisibleCols({ ...visibleCols, phone: e.target.checked })
                        }
                      />
                      <span>Phone number</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={visibleCols.province}
                        onChange={(e) =>
                          setVisibleCols({ ...visibleCols, province: e.target.checked })
                        }
                      />
                      <span>Province</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={visibleCols.status}
                        onChange={(e) =>
                          setVisibleCols({ ...visibleCols, status: e.target.checked })
                        }
                      />
                      <span>Status</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Action Bar (when rows selected) */}
        {selectedIds.length > 0 && (
          <div className="records-bulk-bar">
            <span>
              <strong>{selectedIds.length}</strong> records selected
            </span>
            <div className="bulk-actions">
              <button className="btn btn-secondary btn-sm" onClick={handleBulkVerify} type="button">
                <UserCheck size={14} /> Mark Verified
              </button>
              <button className="btn btn-secondary btn-sm" onClick={exportCSV} type="button">
                <Download size={14} /> Export Selected
              </button>
              <button className="btn btn-secondary btn-sm danger" onClick={handleBulkDelete} type="button">
                <Trash2 size={14} /> Delete
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedIds([])} type="button">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status Tabs Bar */}
        <div className="records-status-bar" role="tablist">
          <button
            role="tab"
            aria-selected={statusTab === "All"}
            className={`records-tab ${statusTab === "All" ? "active" : ""}`}
            onClick={() => {
              setStatusTab("All");
              setPage(1);
            }}
          >
            <span>All records</span>
            <span className="tab-pill">{counts.all.toLocaleString()}</span>
          </button>
          <button
            role="tab"
            aria-selected={statusTab === "Verified"}
            className={`records-tab ${statusTab === "Verified" ? "active" : ""}`}
            onClick={() => {
              setStatusTab("Verified");
              setPage(1);
            }}
          >
            <span>Verified</span>
            <span className="tab-pill pill-verified">{counts.verified.toLocaleString()}</span>
          </button>
          <button
            role="tab"
            aria-selected={statusTab === "Review"}
            className={`records-tab ${statusTab === "Review" ? "active" : ""}`}
            onClick={() => {
              setStatusTab("Review");
              setPage(1);
            }}
          >
            <span>Needs review</span>
            <span className="tab-pill pill-review">{counts.review.toLocaleString()}</span>
          </button>
          <button
            role="tab"
            aria-selected={statusTab === "Incomplete"}
            className={`records-tab ${statusTab === "Incomplete" ? "active" : ""}`}
            onClick={() => {
              setStatusTab("Incomplete");
              setPage(1);
            }}
          >
            <span>Incomplete</span>
            <span className="tab-pill pill-incomplete">{counts.incomplete.toLocaleString()}</span>
          </button>
        </div>

        {/* Records Table */}
        <div className="table-scroll">
          <table className="records-table">
            <thead>
              <tr>
                <th style={{ width: 42 }}>
                  <input
                    type="checkbox"
                    aria-label="Select all on this page"
                    checked={pageRows.length > 0 && selectedIds.length === pageRows.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>
                  <button className="table-sort-btn" onClick={() => handleSort("id")} type="button">
                    <span>RECORD ID</span>
                    {sortField === "id" ? (
                      sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={13} />
                    )}
                  </button>
                </th>
                <th>
                  <button className="table-sort-btn" onClick={() => handleSort("khmer")} type="button">
                    <span>KHMER NAME</span>
                    {sortField === "khmer" ? (
                      sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={13} />
                    )}
                  </button>
                </th>
                <th>
                  <button className="table-sort-btn" onClick={() => handleSort("latin")} type="button">
                    <span>LATIN NAME</span>
                    {sortField === "latin" ? (
                      sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={13} />
                    )}
                  </button>
                </th>
                {visibleCols.dob && (
                  <th>
                    <button className="table-sort-btn" onClick={() => handleSort("dob")} type="button">
                      <span>DATE OF BIRTH</span>
                      {sortField === "dob" ? (
                        sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} />
                      )}
                    </button>
                  </th>
                )}
                {visibleCols.gender && <th>GENDER</th>}
                {visibleCols.phone && <th>PHONE NUMBER</th>}
                {visibleCols.province && <th>PROVINCE</th>}
                {visibleCols.status && (
                  <th>
                    <button className="table-sort-btn" onClick={() => handleSort("status")} type="button">
                      <span>STATUS</span>
                      {sortField === "status" ? (
                        sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} />
                      )}
                    </button>
                  </th>
                )}
                <th style={{ width: 50, textAlign: "right" }} />
              </tr>
            </thead>
            <tbody>
              {pageRows.length > 0 ? (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    className={selectedIds.includes(row.id) ? "row-selected" : ""}
                    onClick={() => onViewRecord?.(row)}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                        aria-label={`Select ${row.id}`}
                      />
                    </td>
                    <td>
                      <span className="record-id-badge">{row.id}</span>
                    </td>
                    <td>
                      <span className="record-khmer-text">{row.khmer}</span>
                    </td>
                    <td>
                      <span className="record-latin-text">{row.latin}</span>
                    </td>
                    {visibleCols.dob && <td className="record-cell-muted">{row.dob}</td>}
                    {visibleCols.gender && <td className="record-cell-muted">{row.gender}</td>}
                    {visibleCols.phone && <td className="record-cell-mono">{row.phone}</td>}
                    {visibleCols.province && <td className="record-cell-muted">{row.province}</td>}
                    {visibleCols.status && (
                      <td>
                        <span
                          className={`record-status-pill ${
                            row.status === "Verified"
                              ? "pill-verified"
                              : row.status === "Review"
                                ? "pill-review"
                                : "pill-incomplete"
                          }`}
                        >
                          <i className="status-dot" />
                          <span>{row.status === "Review" ? "Review" : row.status}</span>
                        </span>
                      </td>
                    )}
                    <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                      <button
                        className="row-action-btn"
                        onClick={() => onViewRecord?.(row)}
                        title="View details"
                        aria-label={`View details for ${row.id}`}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="empty-table-cell">
                    <div className="empty-table-state">
                      <AlertCircle size={28} />
                      <strong>No records found</strong>
                      <span>Try adjusting your search keywords or filter options.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Functional Pagination Bar */}
        <div className="records-pagination">
          <span className="pagination-info">
            Showing <strong>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredRecords.length)}</strong> of{" "}
            <strong>{counts.all.toLocaleString()}</strong> records
          </span>

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
              type="button"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`pagination-num ${page === p ? "active" : ""}`}
                onClick={() => setPage(p)}
                type="button"
              >
                {p}
              </button>
            ))}

            <button
              className="pagination-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
              type="button"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Create New Record Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div
            className="form-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h2>Create Identity Record</h2>
                <p>Enter the citizen's official credentials as shown on their identification card.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} aria-label="Close" type="button">
                <X size={18} />
              </button>
            </div>

            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const newRec: IdentityRecord = {
                  id: `KID-${Math.floor(10000 + Math.random() * 90000)}`,
                  khmer: (form.elements.namedItem("khmerName") as HTMLInputElement).value || "ឈ្មោះថ្មី",
                  latin: (form.elements.namedItem("latinName") as HTMLInputElement).value || "New Citizen",
                  dob: (form.elements.namedItem("dob") as HTMLInputElement).value || "01 Jan 1995",
                  gender: ((form.elements.namedItem("gender") as HTMLSelectElement).value as any) || "Female",
                  phone: (form.elements.namedItem("phone") as HTMLInputElement).value || "+855 12 000 000",
                  province: (form.elements.namedItem("province") as HTMLInputElement).value || "Phnom Penh",
                  docId: (form.elements.namedItem("docId") as HTMLInputElement).value || "091000000",
                  docType: "National ID",
                  status: "Verified",
                  source: "Civil Registry",
                  createdAt: "Just now",
                  accuracy: 99.0,
                };
                setRecords([newRec, ...records]);
                setShowCreateModal(false);
                showToast(`Record ${newRec.id} created successfully.`);
              }}
            >
              <label>
                <span>Khmer full name (ឈ្មោះពេញ)</span>
                <input name="khmerName" className="khmer" placeholder="សុខ ចាន់ដា" required />
              </label>
              <label>
                <span>Latin full name</span>
                <input name="latinName" placeholder="Sok Chanda" required />
              </label>
              <label>
                <span>Date of birth</span>
                <input name="dob" type="date" required />
              </label>
              <label>
                <span>Gender</span>
                <select name="gender">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </label>
              <label>
                <span>Phone number</span>
                <input name="phone" placeholder="+855 12 345 678" required />
              </label>
              <label>
                <span>Province / Municipality</span>
                <input name="province" placeholder="Phnom Penh" required />
              </label>
              <label>
                <span>National Document ID</span>
                <input name="docId" placeholder="091842761" required />
              </label>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  <CheckCircle2 size={16} /> Save Record
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
