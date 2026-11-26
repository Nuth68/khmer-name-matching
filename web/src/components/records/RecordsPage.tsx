import { useMemo, useState, useRef, useEffect } from "react";
import SearchInput from "../common/SearchInput";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  Download,
  Eye,
  Filter,
  FileText,
  Fingerprint,
  Database,
  LayoutList,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCheck,
  UserRound,
  UserPlus,
  Users,
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
  {
    id: "KID-10472",
    khmer: "អ៊ុក សុផាត",
    latin: "Ouk Sophat",
    dob: "17 Aug 1991",
    gender: "Male",
    phone: "+855 12 890 123",
    province: "Kampong Thom",
    docId: "091234567",
    docType: "National ID",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "15 Jan 2024",
    accuracy: 97.9,
  },
  {
    id: "KID-10471",
    khmer: "ស៊ុន ចាន់ធី",
    latin: "Sun Chanthy",
    dob: "05 Dec 1987",
    gender: "Female",
    phone: "+855 97 456 789",
    province: "Pursat",
    docId: "CR-99210",
    docType: "Civil Registry",
    status: "Review",
    source: "Civil Registry",
    createdAt: "11 May 2024",
    accuracy: 90.5,
  },
  {
    id: "KID-10470",
    khmer: "វ៉ាន់ សុខុន",
    latin: "Van Sokhon",
    dob: "23 Sep 1993",
    gender: "Male",
    phone: "+855 81 234 567",
    province: "Svay Rieng",
    docId: "098712345",
    docType: "National ID",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "03 Mar 2024",
    accuracy: 98.7,
  },
  {
    id: "KID-10469",
    khmer: "តែ សុធា",
    latin: "Te Sothea",
    dob: "11 Jan 1985",
    gender: "Male",
    phone: "+855 70 876 543",
    province: "Kampot",
    docId: "N1992011",
    docType: "Passport",
    status: "Verified",
    source: "Immigration Dept",
    createdAt: "18 Feb 2024",
    accuracy: 99.3,
  },
  {
    id: "KID-10468",
    khmer: "ឡុង ចាន់ណា",
    latin: "Long Channa",
    dob: "29 Jun 1998",
    gender: "Female",
    phone: "+855 69 345 678",
    province: "Phnom Penh",
    docId: "091882190",
    docType: "National ID",
    status: "Incomplete",
    source: "Civil Registry",
    createdAt: "22 Apr 2024",
    accuracy: 72.1,
  },
  {
    id: "KID-10467",
    khmer: "កែវ សំណាង",
    latin: "Keo Samnang",
    dob: "14 Mar 1992",
    gender: "Male",
    phone: "+855 12 765 432",
    province: "Battambang",
    docId: "CR-33012",
    docType: "Civil Registry",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "14 Jan 2024",
    accuracy: 98.2,
  },
  {
    id: "KID-10466",
    khmer: "ម៉ៅ គឹមឡេង",
    latin: "Mao Kimleng",
    dob: "08 Oct 1996",
    gender: "Female",
    phone: "+855 98 123 456",
    province: "Kandal",
    docId: "087612345",
    docType: "National ID",
    status: "Review",
    source: "Civil Registry",
    createdAt: "29 May 2024",
    accuracy: 88.9,
  },
  {
    id: "KID-10465",
    khmer: "ឈុន វុទ្ធី",
    latin: "Chhun Vuthy",
    dob: "19 May 1989",
    gender: "Male",
    phone: "+855 89 654 321",
    province: "Siem Reap",
    docId: "N1554210",
    docType: "Passport",
    status: "Verified",
    source: "Immigration Dept",
    createdAt: "10 Mar 2024",
    accuracy: 97.4,
  },
  {
    id: "KID-10464",
    khmer: "គង់ ស្រីមុំ",
    latin: "Kong Sreymom",
    dob: "02 Feb 1994",
    gender: "Female",
    phone: "+855 77 987 654",
    province: "Kampong Cham",
    docId: "010992381",
    docType: "National ID",
    status: "Verified",
    source: "Civil Registry",
    createdAt: "04 Feb 2024",
    accuracy: 99.0,
  },
  {
    id: "KID-10463",
    khmer: "ស៊ីន វិបុល",
    latin: "Sin Vibol",
    dob: "30 Jul 1990",
    gender: "Male",
    phone: "+855 11 432 109",
    province: "Kratie",
    docId: "DL-90812",
    docType: "Driver License",
    status: "Incomplete",
    source: "Transport Ministry",
    createdAt: "16 Apr 2024",
    accuracy: 75.3,
  },
];

type SortField =
  | "id"
  | "khmer"
  | "latin"
  | "dob"
  | "gender"
  | "phone"
  | "province"
  | "status";

export default function RecordsPage({
  onViewRecord,
}: {
  onViewRecord?: (record: IdentityRecord) => void;
}) {
  const [records, setRecords] = useState<IdentityRecord[]>(initialRecords);
  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"All" | "Verified" | "Review" | "Incomplete">("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showSelectPopover, setShowSelectPopover] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showColumnsPopover, setShowColumnsPopover] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionMenuRowId, setActionMenuRowId] = useState<string | null>(null);
  const [detailModalRecord, setDetailModalRecord] = useState<IdentityRecord | null>(null);
  const [isDetailClosing, setIsDetailClosing] = useState(false);
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
  const [pageSize, setPageSize] = useState(10);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const rowsDropdownRef = useRef<HTMLDivElement>(null);
  const selectDropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(e.target as Node)) {
        setShowRowsDropdown(false);
      }
      if (selectDropdownRef.current && !selectDropdownRef.current.contains(e.target as Node)) {
        setShowSelectPopover(false);
      }
      if (actionMenuRowId && !(e.target as HTMLElement).closest(".row-action-cell")) {
        setActionMenuRowId(null);
      }
    };
    if (showRowsDropdown || showSelectPopover || actionMenuRowId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRowsDropdown, showSelectPopover, actionMenuRowId]);

  useEffect(() => {
    if (detailModalRecord) setIsDetailClosing(false);
  }, [detailModalRecord]);

  const closeDetailDrawer = () => setIsDetailClosing(true);

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
        // Status filter
        if (statusTab !== "All" && row.status !== statusTab) return false;
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
  }, [records, statusTab, query, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const pageRows = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Khmer Name",
      "Latin Name",
      "DOB",
      "Gender",
      "Phone",
      "Province",
      "Status",
    ];
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

  return (
    <div className="records-page-container identity-records-page">
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
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            type="button"
          >
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
            {/* Select Button & Popover */}
            <div className="select-control-group records-popover-anchor" ref={selectDropdownRef}>
              <button
                className={`btn btn-secondary select-toggle-btn ${isSelectMode || selectedIds.length > 0 ? "active" : ""}`}
                onClick={() => {
                  if (selectedIds.length > 0) {
                    setSelectedIds([]);
                    setIsSelectMode(false);
                  } else {
                    setIsSelectMode((prev) => !prev);
                  }
                }}
                type="button"
              >
                <CheckSquare size={15} />
                <span>
                  {selectedIds.length > 0
                    ? `Selected (${selectedIds.length})`
                    : isSelectMode
                      ? "Cancel Selection"
                      : "Select Rows"}
                </span>
              </button>

              <button
                type="button"
                className={`btn btn-secondary select-arrow-btn ${showSelectPopover ? "active" : ""}`}
                onClick={() => {
                  setShowSelectPopover((open) => !open);
                  setShowFilterPopover(false);
                  setShowColumnsPopover(false);
                }}
                aria-label="More selection options"
                aria-expanded={showSelectPopover}
              >
                <ChevronDown size={14} />
              </button>

              {showSelectPopover && (
                <div className="records-popover select-popover">
                  <div className="filter-option-list" role="menu">
                    <button
                      type="button"
                      className="filter-option-item"
                      onClick={() => {
                        setIsSelectMode(true);
                        setSelectedIds(pageRows.map((r) => r.id));
                        setShowSelectPopover(false);
                      }}
                    >
                      <span className="filter-option-left">
                        <CheckCheck size={15} className="filter-status-icon icon-verified" />
                        <span>Select all</span>
                      </span>
                      <span className="filter-option-count">{pageRows.length}</span>
                    </button>

                    <button
                      type="button"
                      className={`filter-option-item ${isSelectMode ? "is-selected" : ""}`}
                      onClick={() => {
                        setIsSelectMode((prev) => !prev);
                        setShowSelectPopover(false);
                      }}
                    >
                      <span className="filter-option-left">
                        <CheckSquare size={15} className="filter-status-icon icon-all" />
                        <span>Select one by one</span>
                      </span>
                      {isSelectMode && <Check size={14} className="filter-option-check" />}
                    </button>

                    {selectedIds.length > 0 && (
                      <>
                        <div className="header-filter-divider" />
                        <button
                          type="button"
                          className="filter-option-item text-muted"
                          onClick={() => {
                            setSelectedIds([]);
                            setIsSelectMode(false);
                            setShowSelectPopover(false);
                          }}
                        >
                          <span className="filter-option-left">
                            <X size={15} className="filter-status-icon icon-incomplete" />
                            <span>Deselect all</span>
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Popover */}
            <div className="records-popover-anchor">
              <button
                className={`btn btn-secondary ${showFilterPopover || statusTab !== "All" ? "active" : ""}`}
                onClick={() => {
                  setShowFilterPopover(!showFilterPopover);
                  setShowColumnsPopover(false);
                }}
                type="button"
              >
                <Filter size={15} />
                <span>Filter</span>
                {statusTab !== "All" && <span className="filter-badge">1</span>}
              </button>
              {showFilterPopover && (
                <div className="records-popover">
                  <div className="records-popover-body">
                    <div className="filter-option-list" role="listbox" aria-label="Status filter">
                      {(
                        [
                          {
                            value: "All",
                            label: "All records",
                            count: counts.all,
                            icon: (
                              <LayoutList
                                size={15}
                                className="filter-status-icon icon-all"
                              />
                            ),
                          },
                          {
                            value: "Verified",
                            label: "Verified",
                            count: counts.verified,
                            icon: (
                              <CheckCircle2
                                size={15}
                                className="filter-status-icon icon-verified"
                              />
                            ),
                          },
                          {
                            value: "Review",
                            label: "Needs review",
                            count: counts.review,
                            icon: (
                              <Clock
                                size={15}
                                className="filter-status-icon icon-review"
                              />
                            ),
                          },
                          {
                            value: "Incomplete",
                            label: "Incomplete",
                            count: counts.incomplete,
                            icon: (
                              <CircleAlert
                                size={15}
                                className="filter-status-icon icon-incomplete"
                              />
                            ),
                          },
                        ] as const
                      ).map(({ value, label, count, icon }) => (
                        <button
                          key={value}
                          type="button"
                          role="option"
                          aria-selected={statusTab === value}
                          className={`filter-option-item ${statusTab === value ? "is-selected" : ""}`}
                          onClick={() => {
                            setStatusTab(value);
                            setPage(1);
                            setShowFilterPopover(false);
                          }}
                        >
                          <span className="filter-option-left">
                            {icon}
                            <span>{label}</span>
                          </span>
                          <span className="filter-option-right">
                            <span className="filter-option-count">
                              {count.toLocaleString()}
                            </span>
                            {statusTab === value && (
                              <Check size={14} className="filter-option-check" />
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
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
                  <div className="filter-option-list" role="list">
                    {(
                      [
                        { key: "dob",      label: "Date of birth", icon: <Calendar  size={15} className="filter-status-icon icon-all" /> },
                        { key: "gender",   label: "Gender",        icon: <Users      size={15} className="filter-status-icon icon-all" /> },
                        { key: "phone",    label: "Phone number",  icon: <Phone      size={15} className="filter-status-icon icon-all" /> },
                        { key: "province", label: "Province",      icon: <MapPin     size={15} className="filter-status-icon icon-all" /> },
                        { key: "status",   label: "Status",        icon: <ShieldCheck size={15} className="filter-status-icon icon-all" /> },
                      ] as const
                    ).map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        className={`filter-option-item ${visibleCols[key] ? "is-selected" : ""}`}
                        onClick={() => setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }))}
                      >
                        <span className="filter-option-left">
                          {icon}
                          <span>{label}</span>
                        </span>
                        {visibleCols[key] && <Check size={14} className="filter-option-check" />}
                      </button>
                    ))}
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
              <button
                className="btn btn-secondary btn-sm danger"
                onClick={handleBulkDelete}
                type="button"
              >
                <Trash2 size={14} /> Delete
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSelectedIds([]);
                  setIsSelectMode(false);
                }}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Records Table */}
        <div className="table-scroll">
          <table className="records-table">
            <thead>
              <tr>
                <th>
                  <button
                    className={`table-sort-btn ${sortField === "id" ? "is-active" : ""}`}
                    onClick={() => handleSort("id")}
                    type="button"
                  >
                    <span>RECORD ID</span>
                    <span className={`table-sort-icon ${sortField === "id" ? "is-active" : ""}`}>
                      {sortField === "id" ? (
                        sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} />
                      )}
                    </span>
                  </button>
                </th>
                <th>
                  <button
                    className={`table-sort-btn ${sortField === "khmer" ? "is-active" : ""}`}
                    onClick={() => handleSort("khmer")}
                    type="button"
                  >
                    <span>KHMER NAME</span>
                    <span className={`table-sort-icon ${sortField === "khmer" ? "is-active" : ""}`}>
                      {sortField === "khmer" ? (
                        sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} />
                      )}
                    </span>
                  </button>
                </th>
                <th>
                  <button
                    className={`table-sort-btn ${sortField === "latin" ? "is-active" : ""}`}
                    onClick={() => handleSort("latin")}
                    type="button"
                  >
                    <span>LATIN NAME</span>
                    <span className={`table-sort-icon ${sortField === "latin" ? "is-active" : ""}`}>
                      {sortField === "latin" ? (
                        sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} />
                      )}
                    </span>
                  </button>
                </th>
                {visibleCols.dob && (
                  <th>
                    <button
                      className={`table-sort-btn ${sortField === "dob" ? "is-active" : ""}`}
                      onClick={() => handleSort("dob")}
                      type="button"
                    >
                      <span>DATE OF BIRTH</span>
                      <span className={`table-sort-icon ${sortField === "dob" ? "is-active" : ""}`}>
                        {sortField === "dob" ? (
                          sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={13} />
                        )}
                      </span>
                    </button>
                  </th>
                )}
                {visibleCols.gender && (
                  <th>
                    <button
                      className={`table-sort-btn ${sortField === "gender" ? "is-active" : ""}`}
                      onClick={() => handleSort("gender")}
                      type="button"
                    >
                      <span>GENDER</span>
                      <span className={`table-sort-icon ${sortField === "gender" ? "is-active" : ""}`}>
                        {sortField === "gender" ? (
                          sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={13} />
                        )}
                      </span>
                    </button>
                  </th>
                )}
                {visibleCols.phone && (
                  <th>
                    <button
                      className={`table-sort-btn ${sortField === "phone" ? "is-active" : ""}`}
                      onClick={() => handleSort("phone")}
                      type="button"
                    >
                      <span>PHONE NUMBER</span>
                      <span className={`table-sort-icon ${sortField === "phone" ? "is-active" : ""}`}>
                        {sortField === "phone" ? (
                          sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={13} />
                        )}
                      </span>
                    </button>
                  </th>
                )}
                {visibleCols.province && (
                  <th>
                    <button
                      className={`table-sort-btn ${sortField === "province" ? "is-active" : ""}`}
                      onClick={() => handleSort("province")}
                      type="button"
                    >
                      <span>PROVINCE</span>
                      <span className={`table-sort-icon ${sortField === "province" ? "is-active" : ""}`}>
                        {sortField === "province" ? (
                          sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={13} />
                        )}
                      </span>
                    </button>
                  </th>
                )}
                {visibleCols.status && (
                  <th>
                    <button
                      className={`table-sort-btn ${sortField === "status" ? "is-active" : ""}`}
                      onClick={() => handleSort("status")}
                      type="button"
                    >
                      <span>STATUS</span>
                      <span className={`table-sort-icon ${sortField === "status" ? "is-active" : ""}`}>
                        {sortField === "status" ? (
                          sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={13} />
                        )}
                      </span>
                    </button>
                  </th>
                )}
                <th
                  className="records-sticky-actions"
                  style={{ width: 0, padding: 0 }}
                  aria-label="Actions"
                />
              </tr>
            </thead>
            <tbody>
              {pageRows.length > 0 ? (
                pageRows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`${selectedIds.includes(row.id) ? "row-selected" : ""} ${
                      isSelectMode ? "is-select-mode" : ""
                    }`}
                    onClick={() => {
                      if (isSelectMode) {
                        toggleSelectRow(row.id);
                      } else if (onViewRecord) {
                        onViewRecord(row);
                      } else {
                        setDetailModalRecord(row);
                      }
                    }}
                  >
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
                          } record-status-icon-only`}
                          aria-label={row.status === "Review" ? "Needs review" : row.status}
                          title={row.status === "Review" ? "Needs review" : row.status}
                        >
                          {row.status === "Verified" && <CheckCircle2 size={22} strokeWidth={2.2} aria-hidden="true" />}
                          {row.status === "Review" && <Clock size={22} strokeWidth={2.2} aria-hidden="true" />}
                          {row.status === "Incomplete" && <CircleAlert size={22} strokeWidth={2.2} aria-hidden="true" />}
                        </span>
                      </td>
                    )}
                    <td
                      className={`row-action-cell records-sticky-actions action-tone-${
                        row.status === "Verified"
                          ? "verified"
                          : row.status === "Review"
                            ? "review"
                            : "incomplete"
                      } ${actionMenuRowId === row.id ? "is-menu-open" : ""}`}
                      onClick={(e) => e.stopPropagation()}
                      onMouseLeave={() => {
                        leaveTimerRef.current = setTimeout(() => {
                          setActionMenuRowId((curr) => (curr === row.id ? null : curr));
                        }, 250);
                      }}
                    >
                      <button
                        type="button"
                        className={`row-action-trigger ${actionMenuRowId === row.id ? "is-active" : ""}`}
                        aria-label="Row actions"
                        aria-expanded={actionMenuRowId === row.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenuRowId(actionMenuRowId === row.id ? null : row.id);
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {actionMenuRowId === row.id && (
                        <div
                          className={`row-action-popover ${rowIndex >= pageRows.length - 2 && pageRows.length > 2 ? "open-up" : ""}`}
                          role="menu"
                          onMouseEnter={() => {
                            if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
                          }}
                        >
                          <button
                            type="button"
                            className="row-action-item"
                            role="menuitem"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuRowId(null);
                              if (onViewRecord) {
                                onViewRecord(row);
                              } else {
                                setDetailModalRecord(row);
                              }
                            }}
                          >
                            <Eye size={15} />
                            <span>View profile</span>
                          </button>

                          <button
                            type="button"
                            className="row-action-item success"
                            role="menuitem"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRecords((prev) =>
                                prev.map((r) =>
                                  r.id === row.id
                                    ? { ...r, status: "Verified" as const, accuracy: 99.2 }
                                    : r
                                )
                              );
                              setActionMenuRowId(null);
                              showToast(`Record ${row.id} marked as Verified.`);
                            }}
                          >
                            <CheckCircle2 size={15} />
                            <span>Make verify</span>
                          </button>

                          <button
                            type="button"
                            className="row-action-item danger"
                            role="menuitem"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRecords((prev) => prev.filter((r) => r.id !== row.id));
                              setSelectedIds((prev) => prev.filter((id) => id !== row.id));
                              setActionMenuRowId(null);
                              showToast(`Record ${row.id} deleted.`);
                            }}
                          >
                            <Trash2 size={15} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="empty-table-cell">
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
          <div className="pagination-left">
            <span className="pagination-info">
              Showing{" "}
              <strong>
                {filteredRecords.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredRecords.length)}
              </strong>{" "}
              of <strong>{counts.all.toLocaleString()}</strong> records
            </span>

            <div className="pagination-rows-select">
              <span className="pagination-rows-label">Rows per page:</span>
              <div className="custom-rows-dropdown" ref={rowsDropdownRef}>
                <button
                  type="button"
                  className={`custom-rows-trigger ${showRowsDropdown ? "active" : ""}`}
                  onClick={() => setShowRowsDropdown((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={showRowsDropdown}
                >
                  <span>{pageSize}</span>
                  <ChevronDown
                    size={14}
                    className={`custom-rows-arrow ${showRowsDropdown ? "is-open" : ""}`}
                  />
                </button>
                {showRowsDropdown && (
                  <div className="custom-rows-menu" role="listbox">
                    {[5, 10, 20, 50].map((size) => (
                      <button
                        key={size}
                        type="button"
                        role="option"
                        aria-selected={pageSize === size}
                        className={`custom-rows-item ${pageSize === size ? "is-selected" : ""}`}
                        onClick={() => {
                          setPageSize(size);
                          setPage(1);
                          setShowRowsDropdown(false);
                        }}
                      >
                        <span>{size}</span>
                        {pageSize === size && (
                          <Check size={14} className="custom-rows-check" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

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
                <p>
                  Enter the citizen's official credentials as shown on their identification card.
                </p>
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
                  latin:
                    (form.elements.namedItem("latinName") as HTMLInputElement).value ||
                    "New Citizen",
                  dob: (form.elements.namedItem("dob") as HTMLInputElement).value || "01 Jan 1995",
                  gender:
                    ((form.elements.namedItem("gender") as HTMLSelectElement).value as any) ||
                    "Female",
                  phone:
                    (form.elements.namedItem("phone") as HTMLInputElement).value ||
                    "+855 12 000 000",
                  province:
                    (form.elements.namedItem("province") as HTMLInputElement).value || "Phnom Penh",
                  docId:
                    (form.elements.namedItem("docId") as HTMLInputElement).value || "091000000",
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
                <button className="btn btn-primary" type="submit">
                  <CheckCircle2 size={16} /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Citizen Identity Dossier Right Side Drawer */}
      {detailModalRecord && (
        <div
          className={`drawer-backdrop${isDetailClosing ? " is-closing" : ""}`}
          onClick={closeDetailDrawer}
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
            backdropFilter: "none",
            zIndex: 1000,
          }}
        >
          <button
            type="button"
            className="drawer-edge-close"
            onClick={closeDetailDrawer}
            aria-label="Close dossier"
            title="Close dossier"
          >
            <ChevronRight size={18} />
          </button>
          <aside
            className={`record-detail-drawer record-detail-dialog${isDetailClosing ? " is-closing" : ""}`}
            onClick={(e) => e.stopPropagation()}
            onAnimationEnd={() => {
              if (isDetailClosing) {
                setDetailModalRecord(null);
                setIsDetailClosing(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Citizen Identity Dossier"
          >
            <div className="dialog-header">
              <div className="dialog-header-left">
                <div className="dialog-title-row">
                  <UserRound size={21} aria-hidden="true" />
                  <h2>{detailModalRecord.latin}</h2>
                </div>
              </div>
            </div>

            <div className="dialog-details-grid">
              <div className="detail-item">
                <span className="detail-label"><Fingerprint size={17} />RECORD ID</span>
                <span className="detail-value">{detailModalRecord.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><ShieldCheck size={17} />STATUS</span>
                <span className="detail-value">{detailModalRecord.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Calendar size={17} />DATE OF BIRTH</span>
                <span className="detail-value">{detailModalRecord.dob}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Users size={17} />GENDER</span>
                <span className="detail-value">{detailModalRecord.gender}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Phone size={17} />PHONE NUMBER</span>
                <span className="detail-value">{detailModalRecord.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><MapPin size={17} />PROVINCE</span>
                <span className="detail-value">{detailModalRecord.province}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FileText size={17} />NATIONAL DOC ID</span>
                <span className="detail-value">
                  {detailModalRecord.docId} ({detailModalRecord.docType})
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Database size={17} />SYSTEM SOURCE</span>
                <span className="detail-value">{detailModalRecord.source}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><CheckCircle2 size={17} />MATCHING ACCURACY</span>
                <span className="detail-value accuracy-score">
                  {detailModalRecord.accuracy}% Confidence
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Calendar size={17} />CREATED AT</span>
                <span className="detail-value">{detailModalRecord.createdAt}</span>
              </div>
            </div>
          </aside>
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
