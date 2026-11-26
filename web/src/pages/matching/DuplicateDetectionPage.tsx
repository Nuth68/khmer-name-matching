import { useMemo, useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeftRight,
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
  Database,
  Download,
  Eye,
  Filter,
  FileSearch,
  FileText,
  Fingerprint,
  MapPin,
  Merge,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import SearchInput from "../../components/common/SearchInput";
import MetricCard from "../../components/common/MetricCard";

export type DuplicateCase = {
  id: string;
  aKhmer: string;
  aLatin: string;
  bKhmer: string;
  bLatin: string;
  dobA: string;
  dobB: string;
  phoneA: string;
  phoneB: string;
  provinceA: string;
  provinceB: string;
  docIdA: string;
  docIdB: string;
  docType: string;
  signals: string;
  score: number;
  status: "Pending" | "In review" | "Resolved";
  source: string;
  createdAt: string;
};

const initialCases: DuplicateCase[] = [
  {
    id: "KID-008421",
    aKhmer: "សុខ ដារ៉ា",
    aLatin: "Sok Dara",
    bKhmer: "សុខ ដារា",
    bLatin: "Sok Dara",
    dobA: "12 Mar 1992",
    dobB: "12 Mar 1992",
    phoneA: "+855 12 345 678",
    phoneB: "+855 12 345 678",
    provinceA: "Phnom Penh",
    provinceB: "Phnom Penh",
    docIdA: "091842761",
    docIdB: "091842761",
    docType: "National ID",
    signals: "DOB, phone and address match",
    score: 96,
    status: "Pending",
    source: "Civil Registry",
    createdAt: "14 Feb 2024",
  },
  {
    id: "KID-008378",
    aKhmer: "ចាន់ សុភា",
    aLatin: "Chan Sophea",
    bKhmer: "ចាន់ សុភាព",
    bLatin: "Chan Sopheap",
    dobA: "04 Nov 1988",
    dobB: "04 Nov 1988",
    phoneA: "+855 96 782 104",
    phoneB: "+855 96 782 100",
    provinceA: "Battambang",
    provinceB: "Battambang",
    docIdA: "N1429810",
    docIdB: "N1429810",
    docType: "Passport",
    signals: "DOB and document number match",
    score: 93,
    status: "Pending",
    source: "Immigration Dept",
    createdAt: "22 May 2024",
  },
  {
    id: "KID-008209",
    aKhmer: "លី ស្រីពេជ្រ",
    aLatin: "Ly Sreypich",
    bKhmer: "លី ស្រីពេជ្រ",
    bLatin: "Ly Sreypich",
    dobA: "21 Jul 1995",
    dobB: "21 Jul 1995",
    phoneA: "+855 10 443 821",
    phoneB: "+855 10 443 821",
    provinceA: "Siem Reap",
    provinceB: "Siem Reap",
    docIdA: "CR-88214",
    docIdB: "CR-88215",
    docType: "Civil Registry",
    signals: "Phone and commune match",
    score: 89,
    status: "In review",
    source: "Civil Registry",
    createdAt: "10 Mar 2024",
  },
  {
    id: "KID-007956",
    aKhmer: "ហេង វណ្ណា",
    aLatin: "Heng Vanna",
    bKhmer: "ហេង វ៉ាន់ណា",
    bLatin: "Heng Vanna",
    dobA: "09 Jan 1990",
    dobB: "09 Jan 1990",
    phoneA: "+855 77 302 119",
    phoneB: "+855 77 302 118",
    provinceA: "Kandal",
    provinceB: "Kandal",
    docIdA: "DL-50921",
    docIdB: "DL-50921",
    docType: "Driver License",
    signals: "Name and address similarity",
    score: 85,
    status: "Pending",
    source: "Transport Ministry",
    createdAt: "05 Apr 2024",
  },
  {
    id: "KID-007812",
    aKhmer: "ជា មករា",
    aLatin: "Chea Makara",
    bKhmer: "ជា ម៉ាករ៉ា",
    bLatin: "Chea Makara",
    dobA: "18 Sep 1986",
    dobB: "18 Sep 1986",
    phoneA: "+855 92 861 305",
    phoneB: "+855 92 861 305",
    provinceA: "Kampong Cham",
    provinceB: "Kampong Cham",
    docIdA: "010839215",
    docIdB: "010839215",
    docType: "National ID",
    signals: "Document number partially matches",
    score: 81,
    status: "Resolved",
    source: "Civil Registry",
    createdAt: "18 Jan 2024",
  },
  {
    id: "KID-007740",
    aKhmer: "គឹម សុវណ្ណ",
    aLatin: "Kim Sovann",
    bKhmer: "គឹម សុវ៉ាន់",
    bLatin: "Kim Sovann",
    dobA: "15 Apr 1993",
    dobB: "15 Apr 1993",
    phoneA: "+855 88 519 283",
    phoneB: "+855 88 519 283",
    provinceA: "Takeo",
    provinceB: "Takeo",
    docIdA: "CR-40291",
    docIdB: "CR-40291",
    docType: "Civil Registry",
    signals: "Same phone and family book ID",
    score: 94,
    status: "In review",
    source: "Civil Registry",
    createdAt: "12 May 2024",
  },
  {
    id: "KID-007629",
    aKhmer: "មាស ចន្ទ្រា",
    aLatin: "Meas Chantra",
    bKhmer: "មាស ចន្រ្ទា",
    bLatin: "Meas Chantrea",
    dobA: "28 Dec 1997",
    dobB: "28 Dec 1997",
    phoneA: "+855 78 220 914",
    phoneB: "+855 78 220 914",
    provinceA: "Kampot",
    provinceB: "Kampot",
    docIdA: "081920472",
    docIdB: "081920472",
    docType: "National ID",
    signals: "Name phonetic match and birth certificate",
    score: 91,
    status: "Pending",
    source: "Civil Registry",
    createdAt: "02 Feb 2024",
  },
  {
    id: "KID-007551",
    aKhmer: "នាង ស្រីនិច",
    aLatin: "Neang Sreynich",
    bKhmer: "នាង ស្រីនិក",
    bLatin: "Neang Sreynich",
    dobA: "03 Jun 1994",
    dobB: "03 Jun 1994",
    phoneA: "+855 93 401 829",
    phoneB: "+855 93 401 829",
    provinceA: "Prey Veng",
    provinceB: "Prey Veng",
    docIdA: "N1829471",
    docIdB: "N1829471",
    docType: "Passport",
    signals: "National ID and photo biometric match",
    score: 98,
    status: "Resolved",
    source: "National ID Dept",
    createdAt: "19 Apr 2024",
  },
  {
    id: "KID-007482",
    aKhmer: "អ៊ុង វិសាល",
    aLatin: "Ung Visal",
    bKhmer: "អ៊ុង វិសាល",
    bLatin: "Ung Visal",
    dobA: "22 Oct 1989",
    dobB: "22 Oct 1989",
    phoneA: "+855 11 829 401",
    phoneB: "+855 11 829 401",
    provinceA: "Phnom Penh",
    provinceB: "Kandal",
    docIdA: "092817263",
    docIdB: "092817260",
    docType: "National ID",
    signals: "Duplicate phone number registered",
    score: 87,
    status: "In review",
    source: "Telecom Gateway",
    createdAt: "09 Mar 2024",
  },
  {
    id: "KID-007399",
    aKhmer: "ពេជ្រ សោភា",
    aLatin: "Pech Sophea",
    bKhmer: "ពេជ្រ សុភា",
    bLatin: "Pech Sophea",
    dobA: "14 Feb 1996",
    dobB: "14 Feb 1996",
    phoneA: "+855 85 918 273",
    phoneB: "+855 85 918 273",
    provinceA: "Banteay Meanchey",
    provinceB: "Siem Reap",
    docIdA: "CR-77291",
    docIdB: "CR-77291",
    docType: "Civil Registry",
    signals: "Matching mother name and DOB",
    score: 90,
    status: "Pending",
    source: "Civil Registry",
    createdAt: "27 Jan 2024",
  },
];

type SortField = "id" | "aKhmer" | "score" | "status";

export default function DuplicateDetectionPage({
  navigate,
}: {
  navigate: (route: string) => void;
}) {
  const [cases, setCases] = useState<DuplicateCase[]>(initialCases);
  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"All" | "Pending" | "In review" | "Resolved">("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showSelectPopover, setShowSelectPopover] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showColumnsPopover, setShowColumnsPopover] = useState(false);
  const [actionMenuRowId, setActionMenuRowId] = useState<string | null>(null);
  const [detailModalCase, setDetailModalCase] = useState<DuplicateCase | null>(null);
  const [isDetailClosing, setIsDetailClosing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortAsc, setSortAsc] = useState(false);

  // Column visibility
  const [visibleCols, setVisibleCols] = useState({
    bRecord: true,
    signals: true,
    score: true,
    status: true,
  });

  // Filter options
  const [scoreFilter, setScoreFilter] = useState<"all" | "high" | "medium" | "low">("all");

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered & Sorted Cases
  const filteredCases = useMemo(() => {
    return cases
      .filter((c) => {
        if (statusTab !== "All" && c.status !== statusTab) return false;
        if (scoreFilter === "high" && c.score < 90) return false;
        if (scoreFilter === "medium" && (c.score < 80 || c.score >= 90)) return false;
        if (scoreFilter === "low" && c.score >= 80) return false;

        if (!query.trim()) return true;
        const q = query.toLowerCase().trim();
        return (
          c.id.toLowerCase().includes(q) ||
          c.aKhmer.toLowerCase().includes(q) ||
          c.aLatin.toLowerCase().includes(q) ||
          c.bKhmer.toLowerCase().includes(q) ||
          c.bLatin.toLowerCase().includes(q) ||
          c.signals.toLowerCase().includes(q) ||
          c.provinceA.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "id") cmp = a.id.localeCompare(b.id);
        else if (sortField === "aKhmer") cmp = a.aKhmer.localeCompare(b.aKhmer);
        else if (sortField === "score") cmp = a.score - b.score;
        else if (sortField === "status") cmp = a.status.localeCompare(b.status);
        return sortAsc ? cmp : -cmp;
      });
  }, [cases, query, statusTab, scoreFilter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, page, pageSize]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: cases.length,
      pending: cases.filter((c) => c.status === "Pending").length,
      review: cases.filter((c) => c.status === "In review").length,
      resolved: cases.filter((c) => c.status === "Resolved").length,
    };
  }, [cases]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAllOnPage = () => {
    const pageIds = pageRows.map((r) => r.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleBulkResolve = () => {
    setCases((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status: "Resolved" as const } : c)),
    );
    showToast(`Marked ${selectedIds.length} case(s) as Resolved.`);
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const handleBulkDelete = () => {
    setCases((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    showToast(`Deleted ${selectedIds.length} duplicate case(s).`);
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const exportCSV = () => {
    const rowsToExport =
      selectedIds.length > 0 ? cases.filter((c) => selectedIds.includes(c.id)) : filteredCases;
    const headers = [
      "Case ID",
      "Record A Khmer",
      "Record A Latin",
      "Record B Khmer",
      "Record B Latin",
      "Similarity",
      "Matching Signals",
      "Status",
      "Source",
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rowsToExport.map((c) =>
          [
            c.id,
            `"${c.aKhmer}"`,
            `"${c.aLatin}"`,
            `"${c.bKhmer}"`,
            `"${c.bLatin}"`,
            `${c.score}%`,
            `"${c.signals}"`,
            c.status,
            `"${c.source}"`,
          ].join(","),
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `duplicate_cases_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${rowsToExport.length} duplicate record(s).`);
  };

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast("Scan completed. 10 duplicate candidates identified.");
    }, 900);
  };

  const closeDetailDrawer = () => {
    if (!detailModalCase || isDetailClosing) return;
    setIsDetailClosing(true);
  };

  const openDetailDrawer = (duplicateCase: DuplicateCase) => {
    setIsDetailClosing(false);
    setDetailModalCase(duplicateCase);
  };

  return (
    <div className="records-page duplicate-detection-page">
      {/* Page Header */}
      <div className="records-header-section">
        <div className="records-header-text">
          <h1 className="records-title">Duplicate Detection</h1>
        </div>
        <div className="records-header-actions">
          <button className="btn btn-secondary" onClick={exportCSV} type="button">
            <Download size={15} />
            <span>Export results</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={triggerScan}
            disabled={isScanning}
            type="button"
          >
            {isScanning ? <RefreshCw size={15} className="spin" /> : <Zap size={15} />}
            <span>{isScanning ? "Scanning..." : "Run new scan"}</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="metric-grid compact" style={{ marginBottom: 20 }}>
        <MetricCard
          label="Potential duplicates"
          value="1,284"
          trend="+32"
          icon={Fingerprint}
          tone="amber"
        />
        <MetricCard label="High confidence" value="386" trend="+12" icon={AlertCircle} tone="red" />
        <MetricCard label="Under review" value="74" trend="+8" icon={FileSearch} tone="blue" />
        <MetricCard
          label="Resolved this month"
          value="542"
          trend="+18.6%"
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      {/* Main Toolbar & Table Container */}
      <div className="records-table-container">
        {/* Status Filter Tabs & Controls */}
        <div className="records-toolbar-card">
          <div className="status-filter-tabs">
            <button
              className={`status-tab ${statusTab === "All" ? "active" : ""}`}
              onClick={() => {
                setStatusTab("All");
                setPage(1);
              }}
              type="button"
            >
              <span>All Cases</span>
              <span className="tab-count">{counts.all}</span>
            </button>
            <button
              className={`status-tab ${statusTab === "Pending" ? "active" : ""}`}
              onClick={() => {
                setStatusTab("Pending");
                setPage(1);
              }}
              type="button"
            >
              <CircleAlert size={14} className="tab-icon-review" />
              <span>Pending</span>
              <span className="tab-count">{counts.pending}</span>
            </button>
            <button
              className={`status-tab ${statusTab === "In review" ? "active" : ""}`}
              onClick={() => {
                setStatusTab("In review");
                setPage(1);
              }}
              type="button"
            >
              <Clock size={14} className="tab-icon-incomplete" />
              <span>In review</span>
              <span className="tab-count">{counts.review}</span>
            </button>
            <button
              className={`status-tab ${statusTab === "Resolved" ? "active" : ""}`}
              onClick={() => {
                setStatusTab("Resolved");
                setPage(1);
              }}
              type="button"
            >
              <CheckCircle2 size={14} className="tab-icon-verified" />
              <span>Resolved</span>
              <span className="tab-count">{counts.resolved}</span>
            </button>
          </div>

          <div className="records-control-bar">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input-field"
                placeholder="Search duplicate cases or names…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
              {query && (
                <button
                  className="search-clear-btn"
                  onClick={() => setQuery("")}
                  type="button"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Select Rows Mode / Options Popover */}
            <div className="select-control-group" ref={selectDropdownRef}>
              <button
                type="button"
                className={`btn btn-secondary select-toggle-btn ${
                  isSelectMode || selectedIds.length > 0 ? "active" : ""
                }`}
                onClick={() => {
                  if (selectedIds.length > 0) {
                    setSelectedIds([]);
                    setIsSelectMode(false);
                  } else {
                    setIsSelectMode(!isSelectMode);
                  }
                }}
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
                onClick={() => setShowSelectPopover(!showSelectPopover)}
                aria-label="More selection options"
              >
                <ChevronDown size={14} />
              </button>

              {showSelectPopover && (
                <div className="records-popover select-popover">
                  <div className="filter-option-list" role="list">
                    <button
                      type="button"
                      className="filter-option-item"
                      onClick={() => {
                        setIsSelectMode(true);
                        handleSelectAllOnPage();
                        setShowSelectPopover(false);
                      }}
                    >
                      <span className="filter-option-left">
                        <CheckCheck size={15} className="filter-status-icon icon-verified" />
                        <span>Select all on page</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="filter-option-item"
                      onClick={() => {
                        setSelectedIds(filteredCases.map((c) => c.id));
                        setIsSelectMode(true);
                        setShowSelectPopover(false);
                      }}
                    >
                      <span className="filter-option-left">
                        <CheckSquare size={15} className="filter-status-icon icon-all" />
                        <span>Select all filtered ({filteredCases.length})</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="filter-option-item"
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
                  </div>
                </div>
              )}
            </div>

            {/* Filter Popover */}
            <div className="records-popover-anchor">
              <button
                className={`btn btn-secondary ${showFilterPopover ? "active" : ""}`}
                onClick={() => {
                  setShowFilterPopover(!showFilterPopover);
                  setShowColumnsPopover(false);
                }}
                type="button"
              >
                <Filter size={15} />
                <span>Score: {scoreFilter === "all" ? "All" : scoreFilter.toUpperCase()}</span>
              </button>
              {showFilterPopover && (
                <div className="records-popover filter-popover">
                  <div className="filter-popover-header">
                    <h4>Filter by Similarity</h4>
                  </div>
                  <div className="filter-option-list" role="list">
                    {[
                      { key: "all", label: "All Scores" },
                      { key: "high", label: "High Confidence (>90%)" },
                      { key: "medium", label: "Medium Similarity (80–90%)" },
                      { key: "low", label: "Low Similarity (<80%)" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`filter-option-item ${scoreFilter === opt.key ? "is-selected" : ""}`}
                        onClick={() => {
                          setScoreFilter(opt.key as any);
                          setShowFilterPopover(false);
                        }}
                      >
                        <span className="filter-option-left">
                          <span>{opt.label}</span>
                        </span>
                        {scoreFilter === opt.key && (
                          <Check size={14} className="filter-option-check" />
                        )}
                      </button>
                    ))}
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
                    {[
                      { key: "bRecord", label: "Potential Match (Record B)" },
                      { key: "signals", label: "Matching Signals" },
                      { key: "score", label: "Similarity" },
                      { key: "status", label: "Status" },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        className={`filter-option-item ${
                          visibleCols[key as keyof typeof visibleCols] ? "is-selected" : ""
                        }`}
                        onClick={() =>
                          setVisibleCols((prev) => ({
                            ...prev,
                            [key]: !prev[key as keyof typeof visibleCols],
                          }))
                        }
                      >
                        <span className="filter-option-left">
                          <span>{label}</span>
                        </span>
                        {visibleCols[key as keyof typeof visibleCols] && (
                          <Check size={14} className="filter-option-check" />
                        )}
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
              <strong>{selectedIds.length}</strong> cases selected
            </span>
            <div className="bulk-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleBulkResolve}
                type="button"
              >
                <CheckCircle2 size={14} /> Mark Resolved
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

        {/* Duplicate Cases Table */}
        <div className="table-scroll">
          <table className="records-table">
            <thead>
              <tr>
                {isSelectMode && (
                  <th style={{ width: 44, padding: "0 0 0 16px" }}>
                    <label className="custom-checkbox" aria-label="Select all on page">
                      <input
                        type="checkbox"
                        checked={
                          pageRows.length > 0 && pageRows.every((r) => selectedIds.includes(r.id))
                        }
                        onChange={handleSelectAllOnPage}
                      />
                      <span className="checkbox-box">
                        <Check size={12} className="check-icon" />
                      </span>
                    </label>
                  </th>
                )}
                <th>
                  <button
                    className={`table-sort-btn ${sortField === "id" ? "is-active" : ""}`}
                    onClick={() => handleSort("id")}
                    type="button"
                  >
                    <span>CASE ID</span>
                    <span className={`table-sort-icon ${sortField === "id" ? "is-active" : ""}`}>
                      {sortField === "id" ? (
                        sortAsc ? (
                          <ArrowUp size={13} />
                        ) : (
                          <ArrowDown size={13} />
                        )
                      ) : (
                        <ArrowUpDown size={13} />
                      )}
                    </span>
                  </button>
                </th>
                <th>
                  <button
                    className={`table-sort-btn ${sortField === "aKhmer" ? "is-active" : ""}`}
                    onClick={() => handleSort("aKhmer")}
                    type="button"
                  >
                    <span>RECORD A</span>
                    <span
                      className={`table-sort-icon ${sortField === "aKhmer" ? "is-active" : ""}`}
                    >
                      {sortField === "aKhmer" ? (
                        sortAsc ? (
                          <ArrowUp size={13} />
                        ) : (
                          <ArrowDown size={13} />
                        )
                      ) : (
                        <ArrowUpDown size={13} />
                      )}
                    </span>
                  </button>
                </th>
                {visibleCols.bRecord && <th>POTENTIAL MATCH (RECORD B)</th>}
                {visibleCols.signals && <th>MATCHING SIGNALS</th>}
                {visibleCols.score && (
                  <th>
                    <button
                      className={`table-sort-btn ${sortField === "score" ? "is-active" : ""}`}
                      onClick={() => handleSort("score")}
                      type="button"
                    >
                      <span>SIMILARITY</span>
                      <span
                        className={`table-sort-icon ${sortField === "score" ? "is-active" : ""}`}
                      >
                        {sortField === "score" ? (
                          sortAsc ? (
                            <ArrowUp size={13} />
                          ) : (
                            <ArrowDown size={13} />
                          )
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
                      <span
                        className={`table-sort-icon ${sortField === "status" ? "is-active" : ""}`}
                      >
                        {sortField === "status" ? (
                          sortAsc ? (
                            <ArrowUp size={13} />
                          ) : (
                            <ArrowDown size={13} />
                          )
                        ) : (
                          <ArrowUpDown size={13} />
                        )}
                      </span>
                    </button>
                  </th>
                )}
                <th className="records-sticky-actions" aria-hidden="true" />
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
                      } else {
                        openDetailDrawer(row);
                      }
                    }}
                  >
                    {isSelectMode && (
                      <td style={{ width: 44, padding: "0 0 0 16px" }}>
                        <label
                          className="custom-checkbox"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${row.id}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={() => toggleSelectRow(row.id)}
                          />
                          <span className="checkbox-box">
                            <Check size={12} className="check-icon" />
                          </span>
                        </label>
                      </td>
                    )}
                    <td>
                      <span className="record-id-badge">{row.id}</span>
                    </td>
                    <td>
                      <div className="duplicate-citizen-cell">
                        <span className="record-khmer-text">{row.aKhmer}</span>
                        <span className="record-latin-text">{row.aLatin}</span>
                      </div>
                    </td>
                    {visibleCols.bRecord && (
                      <td>
                        <div className="duplicate-citizen-cell">
                          <span className="record-khmer-text">{row.bKhmer}</span>
                          <span className="record-latin-text">{row.bLatin}</span>
                        </div>
                      </td>
                    )}
                    {visibleCols.signals && <td className="record-cell-muted">{row.signals}</td>}
                    {visibleCols.score && (
                      <td>
                        <div
                          className={`duplicate-score-badge ${
                            row.score >= 90
                              ? "duplicate-score-high"
                              : row.score >= 80
                                ? "duplicate-score-medium"
                                : "duplicate-score-low"
                          }`}
                        >
                          <span>{row.score}%</span>
                        </div>
                      </td>
                    )}
                    {visibleCols.status && (
                      <td>
                        <span
                          className={`record-status-pill ${
                            row.status === "Resolved"
                              ? "pill-verified"
                              : row.status === "In review"
                                ? "pill-review"
                                : "pill-incomplete"
                          } record-status-icon-only`}
                          aria-label={row.status}
                          title={row.status}
                        >
                          {row.status === "Resolved" && (
                            <CheckCircle2 size={22} strokeWidth={2.2} aria-hidden="true" />
                          )}
                          {row.status === "In review" && (
                            <Clock size={22} strokeWidth={2.2} aria-hidden="true" />
                          )}
                          {row.status === "Pending" && (
                            <CircleAlert size={22} strokeWidth={2.2} aria-hidden="true" />
                          )}
                        </span>
                      </td>
                    )}
                    <td
                      className={`row-action-cell records-sticky-actions action-tone-${
                        row.status === "Resolved"
                          ? "verified"
                          : row.status === "In review"
                            ? "review"
                            : "incomplete"
                      } ${actionMenuRowId === row.id ? "is-menu-open" : ""}`}
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={() => {
                        if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
                      }}
                      onMouseLeave={() => {
                        leaveTimerRef.current = setTimeout(() => {
                          setActionMenuRowId((curr) => (curr === row.id ? null : curr));
                        }, 250);
                      }}
                    >
                      <button
                        type="button"
                        className={`row-action-trigger ${
                          actionMenuRowId === row.id ? "is-active" : ""
                        }`}
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
                          className={`row-action-popover ${
                            rowIndex >= pageRows.length - 2 && pageRows.length > 2 ? "open-up" : ""
                          }`}
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
                              openDetailDrawer(row);
                            }}
                          >
                            <Eye size={15} />
                            <span>View comparison</span>
                          </button>

                          <button
                            type="button"
                            className="row-action-item"
                            role="menuitem"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuRowId(null);
                              navigate("Review & Merge");
                            }}
                          >
                            <ArrowLeftRight size={15} />
                            <span>Compare & Merge</span>
                          </button>

                          <button
                            type="button"
                            className="row-action-item success"
                            role="menuitem"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCases((prev) =>
                                prev.map((c) =>
                                  c.id === row.id ? { ...c, status: "Resolved" as const } : c,
                                ),
                              );
                              setActionMenuRowId(null);
                              showToast(`Case ${row.id} marked as Resolved.`);
                            }}
                          >
                            <CheckCircle2 size={15} />
                            <span>Mark Resolved</span>
                          </button>

                          <button
                            type="button"
                            className="row-action-item danger"
                            role="menuitem"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCases((prev) => prev.filter((c) => c.id !== row.id));
                              setSelectedIds((prev) => prev.filter((id) => id !== row.id));
                              setActionMenuRowId(null);
                              showToast(`Case ${row.id} deleted.`);
                            }}
                          >
                            <Trash2 size={15} />
                            <span>Delete case</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: "center", padding: "48px 16px", color: "var(--muted)" }}
                  >
                    No duplicate cases found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-bar">
          <div className="pagination-left">
            <span className="pagination-info">
              Showing{" "}
              <strong>
                {filteredCases.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filteredCases.length)}
              </strong>{" "}
              of <strong>{filteredCases.length}</strong> duplicate cases
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
                        {pageSize === size && <Check size={14} className="custom-rows-check" />}
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
              onClick={() => setPage(page - 1)}
              type="button"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (totalPages > 7) {
                  if (p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                    if (p === 2 || p === totalPages - 1) {
                      return (
                        <span key={p} className="pagination-ellipsis">
                          …
                        </span>
                      );
                    }
                    return null;
                  }
                }
                return (
                  <button
                    key={p}
                    className={`pagination-number ${page === p ? "is-active" : ""}`}
                    onClick={() => setPage(p)}
                    type="button"
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-btn"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              type="button"
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Citizen Identity Duplicate Comparison Right Side Drawer */}
      {detailModalCase && (
        <div
          className={`drawer-backdrop duplicate-dossier-backdrop${isDetailClosing ? " is-closing" : ""}`}
          onClick={closeDetailDrawer}
        >
          <button
            type="button"
            className="drawer-edge-close duplicate-drawer-edge-close"
            onClick={closeDetailDrawer}
            aria-label="Close duplicate comparison"
            title="Close duplicate comparison"
          >
            <ChevronRight size={19} />
          </button>
          <aside
            className={`record-detail-drawer record-detail-dialog duplicate-detail-drawer${isDetailClosing ? " is-closing" : ""}`}
            onClick={(e) => e.stopPropagation()}
            onAnimationEnd={() => {
              if (isDetailClosing) {
                setDetailModalCase(null);
                setIsDetailClosing(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Duplicate Comparison Dossier"
          >
            <div className="dialog-header">
              <div className="dialog-header-left">
                <div className="dialog-title-row">
                  <UserRound aria-hidden="true" />
                  <h2>Duplicate Comparison</h2>
                </div>
                <span className="dialog-record-id">{detailModalCase.id}</span>
              </div>
              <div className="dialog-header-actions">
                <button
                  type="button"
                  className="dialog-close-btn duplicate-mobile-close"
                  onClick={closeDetailDrawer}
                  title="Close"
                  aria-label="Close duplicate comparison"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            <div className="duplicate-pair-comparison">
              <div className="duplicate-pair-side">
                <span className="side-tag">RECORD A</span>
                <h3 className="profile-khmer-name">{detailModalCase.aKhmer}</h3>
                <span className="profile-latin-name">{detailModalCase.aLatin}</span>
              </div>
              <div className="duplicate-pair-vs">VS</div>
              <div className="duplicate-pair-side" style={{ textAlign: "right" }}>
                <span className="side-tag">RECORD B</span>
                <h3 className="profile-khmer-name">{detailModalCase.bKhmer}</h3>
                <span className="profile-latin-name">{detailModalCase.bLatin}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                className={`duplicate-score-badge ${
                  detailModalCase.score >= 90
                    ? "duplicate-score-high"
                    : detailModalCase.score >= 80
                      ? "duplicate-score-medium"
                      : "duplicate-score-low"
                }`}
              >
                <Sparkles size={14} />
                <span>{detailModalCase.score}% Similarity Match</span>
              </div>
              <span
                className={`record-status-pill ${
                  detailModalCase.status === "Resolved"
                    ? "pill-verified"
                    : detailModalCase.status === "In review"
                      ? "pill-review"
                      : "pill-incomplete"
                }`}
              >
                {detailModalCase.status === "Resolved" && <CheckCircle2 size={14} />}
                {detailModalCase.status === "In review" && <Clock size={14} />}
                {detailModalCase.status === "Pending" && <CircleAlert size={14} />}
                {detailModalCase.status}
              </span>
            </div>

            <div className="dialog-details-grid">
              <div className="detail-item">
                <span className="detail-label"><Fingerprint />CASE ID</span>
                <span className="detail-value">{detailModalCase.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><ShieldCheck />STATUS</span>
                <span className="detail-value">{detailModalCase.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Calendar />RECORD A DATE OF BIRTH</span>
                <span className="detail-value">{detailModalCase.dobA}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Calendar />RECORD B DATE OF BIRTH</span>
                <span className="detail-value">{detailModalCase.dobB}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Phone />RECORD A PHONE</span>
                <span className="detail-value">{detailModalCase.phoneA}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Phone />RECORD B PHONE</span>
                <span className="detail-value">{detailModalCase.phoneB}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><MapPin />RECORD A PROVINCE</span>
                <span className="detail-value">{detailModalCase.provinceA}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><MapPin />RECORD B PROVINCE</span>
                <span className="detail-value">{detailModalCase.provinceB}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FileText />RECORD A DOCUMENT</span>
                <span className="detail-value">{detailModalCase.docIdA} ({detailModalCase.docType})</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FileText />RECORD B DOCUMENT</span>
                <span className="detail-value">{detailModalCase.docIdB} ({detailModalCase.docType})</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Database />SYSTEM SOURCE</span>
                <span className="detail-value">{detailModalCase.source}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><Calendar />CREATED AT</span>
                <span className="detail-value">{detailModalCase.createdAt}</span>
              </div>
              <div className="detail-item detail-item-wide">
                <span className="detail-label"><Sparkles />MATCHING SIGNALS</span>
                <span className="detail-value">{detailModalCase.signals}</span>
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
