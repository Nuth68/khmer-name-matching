import { useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Info,
  LayoutGrid,
  List,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

export interface SmartSearchIdentity {
  id: string;
  khmer: string;
  latin: string;
  dob: string;
  age: number;
  gender: "Male" | "Female";
  phone: string;
  province: string;
  docType: string;
  docNumber: string;
  status: "Verified" | "Review" | "Pending";
  score: number;
  matchType: "Strong match" | "Possible match" | "Weak match";
  detail: string;
  signals: {
    orthographic: number;
    phonetic: number;
    latin: number;
    demographic: string;
  };
}

const SEARCH_SUGGESTIONS = [
  "Sok Dara",
  "សុខ ដារ៉ា",
  "Chan Sophea",
  "ចាន់ សុភា",
  "Chea Makara",
  "ជា មករា",
  "KID-10482",
  "091842761",
];

const PROVINCES = [
  "All Provinces",
  "Phnom Penh",
  "Battambang",
  "Siem Reap",
  "Kampong Cham",
  "Kandal",
  "Banteay Meanchey",
];

const INITIAL_IDENTITIES: SmartSearchIdentity[] = [
  {
    id: "KID-008421",
    khmer: "សុខ ដារ៉ា",
    latin: "Sok Dara",
    dob: "12 Mar 1992",
    age: 34,
    gender: "Male",
    phone: "+855 12 345 678",
    province: "Phnom Penh",
    docType: "National ID",
    docNumber: "091842761",
    status: "Verified",
    score: 96,
    matchType: "Strong match",
    detail: "DOB, phone and address match perfectly",
    signals: {
      orthographic: 99,
      phonetic: 98,
      latin: 96,
      demographic: "DOB & Phone confirmed",
    },
  },
  {
    id: "KID-008378",
    khmer: "ចាន់ សុភា",
    latin: "Chan Sophea",
    dob: "04 Nov 1988",
    age: 38,
    gender: "Female",
    phone: "+855 96 782 104",
    province: "Battambang",
    docType: "Passport",
    docNumber: "N1429810",
    status: "Review",
    score: 93,
    matchType: "Strong match",
    detail: "DOB and document number match with slight vowel variant",
    signals: {
      orthographic: 94,
      phonetic: 96,
      latin: 92,
      demographic: "Passport number matches",
    },
  },
  {
    id: "KID-008209",
    khmer: "លី ស្រីពេជ្រ",
    latin: "Ly Sreypich",
    dob: "21 Jul 1995",
    age: 30,
    gender: "Female",
    phone: "+855 10 443 821",
    province: "Siem Reap",
    docType: "Civil Registry",
    docNumber: "CR-88214",
    status: "Verified",
    score: 89,
    matchType: "Possible match",
    detail: "Phone and commune match with romanisation phonetic variance",
    signals: {
      orthographic: 90,
      phonetic: 92,
      latin: 86,
      demographic: "Commune & Operator matched",
    },
  },
  {
    id: "KID-007956",
    khmer: "ហេង វណ្ណា",
    latin: "Heng Vanna",
    dob: "09 Jan 1990",
    age: 36,
    gender: "Male",
    phone: "+855 77 302 119",
    province: "Phnom Penh",
    docType: "National ID",
    docNumber: "021495811",
    status: "Review",
    score: 85,
    matchType: "Possible match",
    detail: "Name and address similarity with partial DOB match",
    signals: {
      orthographic: 88,
      phonetic: 89,
      latin: 84,
      demographic: "District match",
    },
  },
  {
    id: "KID-007812",
    khmer: "ជា មករា",
    latin: "Chea Makara",
    dob: "18 Sep 1986",
    age: 39,
    gender: "Male",
    phone: "+855 92 861 305",
    province: "Kampong Cham",
    docType: "National ID",
    docNumber: "010839215",
    status: "Verified",
    score: 81,
    matchType: "Possible match",
    detail: "Document number partially matches with phonetic variation",
    signals: {
      orthographic: 84,
      phonetic: 85,
      latin: 80,
      demographic: "Province & Year matched",
    },
  },
];

type SearchMode = "intelligent" | "phonetic" | "exact" | "fuzzy";

interface Props {
  onViewRecord?: (record: any) => void;
}

export default function SmartSearchPage({ onViewRecord }: Props) {
  const [query, setQuery] = useState("Sok Dara");
  const [searchMode, setSearchMode] = useState<SearchMode>("intelligent");
  const [minSimilarity, setMinSimilarity] = useState<number>(75);
  const [genderFilter, setGenderFilter] = useState<string>("All");
  const [provinceFilter, setProvinceFilter] = useState<string>("All Provinces");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");
  const [sortBy, setSortBy] = useState<"score" | "name" | "recent">("score");

  // Filter algorithmic toggles
  const [enablePhonetic, setEnablePhonetic] = useState(true);
  const [enableVariants, setEnableVariants] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [enableDemographicBoost, setEnableDemographicBoost] = useState(true);

  // Modal inspection
  const [selectedIdentity, setSelectedIdentity] = useState<SmartSearchIdentity | null>(null);

  const filteredIdentities = useMemo(() => {
    return INITIAL_IDENTITIES.filter((item) => {
      // Threshold filter
      if (item.score < minSimilarity) return false;

      // Gender filter
      if (genderFilter !== "All" && item.gender !== genderFilter) return false;

      // Province filter
      if (provinceFilter !== "All Provinces" && item.province !== provinceFilter) return false;

      // Inactive check
      if (!includeInactive && item.status === "Pending") return false;

      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesName =
          item.latin.toLowerCase().includes(q) ||
          item.khmer.includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.phone.includes(q) ||
          item.docNumber.includes(q);
        if (!matchesName) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "name") return a.latin.localeCompare(b.latin);
      return b.id.localeCompare(a.id);
    });
  }, [query, minSimilarity, genderFilter, provinceFilter, includeInactive, sortBy]);

  const handleResetFilters = () => {
    setMinSimilarity(75);
    setGenderFilter("All");
    setProvinceFilter("All Provinces");
    setEnablePhonetic(true);
    setEnableVariants(true);
    setIncludeInactive(false);
    setEnableDemographicBoost(true);
    setSortBy("score");
  };

  const handleExportCSV = () => {
    const headers = "Record ID,Khmer Name,Latin Name,Gender,DOB,Phone,Province,Doc Type,Doc Number,Similarity Score,Match Classification";
    const rows = filteredIdentities
      .map(
        (i) =>
          `"${i.id}","${i.khmer}","${i.latin}","${i.gender}","${i.dob}","${i.phone}","${i.province}","${i.docType}","${i.docNumber}","${i.score}%","${i.matchType}"`,
      )
      .join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `smart_search_results_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="smart-search-page">
      <div className="page-header">
        <div>
          <h1>Smart Search</h1>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleExportCSV} type="button">
            <Download size={15} />
            <span>Export matches</span>
          </button>
        </div>
      </div>

      {/* Main Hero Search Card */}
      <section className="card smart-search-hero-card">
        <div className="smart-search-bar-wrap">
          <div className="smart-search-input-box">
            <Search size={20} className="smart-search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Khmer name (e.g. សុខ ដារ៉ា), Latin (Sok Dara), KID, phone or ID number…"
              className="smart-search-input"
            />
            {query && (
              <button
                type="button"
                className="smart-search-clear-btn"
                onClick={() => setQuery("")}
                aria-label="Clear query"
              >
                <X size={14} />
              </button>
            )}
            <div className="smart-search-shortcut">⌘K</div>
            <button className="btn btn-primary smart-search-submit-btn" type="button">
              <Sparkles size={16} />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="smart-search-suggestions">
          <span className="suggestion-label">Suggested searches:</span>
          <div className="suggestion-chips">
            {SEARCH_SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`suggestion-chip ${query === tag ? "is-active" : ""}`}
                onClick={() => setQuery(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Mode Segmented Switcher */}
        <div className="smart-search-mode-row">
          <span className="mode-row-label">Search algorithm:</span>
          <div className="smart-mode-tabs" role="tablist">
            <button
              type="button"
              className={`mode-tab ${searchMode === "intelligent" ? "is-active" : ""}`}
              onClick={() => setSearchMode("intelligent")}
            >
              <Sparkles size={14} />
              <span>Intelligent AI Matching</span>
            </button>
            <button
              type="button"
              className={`mode-tab ${searchMode === "phonetic" ? "is-active" : ""}`}
              onClick={() => setSearchMode("phonetic")}
            >
              <span className="mode-tab-symbol">IPA</span>
              <span>Phonetic & Soundex</span>
            </button>
            <button
              type="button"
              className={`mode-tab ${searchMode === "exact" ? "is-active" : ""}`}
              onClick={() => setSearchMode("exact")}
            >
              <CheckCircle2 size={14} />
              <span>Exact Orthographic</span>
            </button>
            <button
              type="button"
              className={`mode-tab ${searchMode === "fuzzy" ? "is-active" : ""}`}
              onClick={() => setSearchMode("fuzzy")}
            >
              <SlidersHorizontal size={14} />
              <span>Cross-Lingual Fuzzy</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="smart-search-layout">
        {/* Left Column: Filter & Tuning Sidebar */}
        <aside className="card smart-search-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">
              <Filter size={16} />
              <span>Search Parameters</span>
            </div>
            <button
              className="sidebar-reset-btn"
              onClick={handleResetFilters}
              type="button"
              title="Reset parameters to defaults"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          {/* Minimum Similarity Slider */}
          <div className="filter-section">
            <div className="filter-section-header">
              <label htmlFor="min-similarity">Minimum Similarity</label>
              <span
                className={`score-threshold-badge ${
                  minSimilarity >= 90 ? "high" : minSimilarity >= 80 ? "medium" : "low"
                }`}
              >
                {minSimilarity}%
              </span>
            </div>
            <input
              id="min-similarity"
              type="range"
              min="60"
              max="100"
              step="1"
              value={minSimilarity}
              onChange={(e) => setMinSimilarity(Number(e.target.value))}
              className="similarity-slider"
            />
            <div className="slider-range-labels">
              <span>60% (Broad)</span>
              <span>80%</span>
              <span>100% (Strict)</span>
            </div>
          </div>

          <div className="sidebar-divider" />

          {/* Algorithmic Toggles */}
          <div className="filter-section">
            <div className="filter-section-label">Matching Modules</div>
            <div className="checkbox-list">
              <label className="smart-checkbox-label">
                <input
                  type="checkbox"
                  checked={enablePhonetic}
                  onChange={(e) => setEnablePhonetic(e.target.checked)}
                />
                <span className="checkbox-custom" />
                <span className="checkbox-text">
                  <strong>Exact and phonetic</strong>
                  <small>Soundex & IPA cross-script audio mapping</small>
                </span>
              </label>

              <label className="smart-checkbox-label">
                <input
                  type="checkbox"
                  checked={enableVariants}
                  onChange={(e) => setEnableVariants(e.target.checked)}
                />
                <span className="checkbox-custom" />
                <span className="checkbox-text">
                  <strong>Include Khmer variants</strong>
                  <small>Subscript ligatures & vowel alternate forms</small>
                </span>
              </label>

              <label className="smart-checkbox-label">
                <input
                  type="checkbox"
                  checked={enableDemographicBoost}
                  onChange={(e) => setEnableDemographicBoost(e.target.checked)}
                />
                <span className="checkbox-custom" />
                <span className="checkbox-text">
                  <strong>Demographic corroboration</strong>
                  <small>Boost ranking when DOB or phone aligns</small>
                </span>
              </label>

              <label className="smart-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeInactive}
                  onChange={(e) => setIncludeInactive(e.target.checked)}
                />
                <span className="checkbox-custom" />
                <span className="checkbox-text">
                  <strong>Include unverified records</strong>
                  <small>Search archived & pending civil files</small>
                </span>
              </label>
            </div>
          </div>

          <div className="sidebar-divider" />

          {/* Demographic Filters */}
          <div className="filter-section">
            <div className="filter-section-label">Gender Demographic</div>
            <div className="gender-segmented-control">
              {["All", "Male", "Female"].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`gender-tab ${genderFilter === g ? "is-active" : ""}`}
                  onClick={() => setGenderFilter(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Province Selector */}
          <div className="filter-section">
            <label className="filter-section-label" htmlFor="province-select">
              Province / Municipality
            </label>
            <select
              id="province-select"
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="smart-select"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Operational Metrics Callout */}
          <div className="search-speed-card">
            <div className="speed-icon-wrap">
              <Sparkles size={16} />
            </div>
            <div>
              <strong>Instant Pipeline</strong>
              <span>Latency: 38 ms · 128,642 identities indexed</span>
            </div>
          </div>
        </aside>

        {/* Right Column: Results List */}
        <main className="smart-search-results-area">
          <div className="card smart-results-toolbar">
            <div className="results-count-wrap">
              <h2>{filteredIdentities.length} matching identities</h2>
              <span className="latency-badge">
                <span className="latency-dot" /> 38 ms
              </span>
            </div>

            <div className="results-toolbar-tools">
              {/* Sort By Dropdown */}
              <div className="sort-control">
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="sort-select"
                >
                  <option value="score">Highest Match</option>
                  <option value="name">Name (A–Z)</option>
                  <option value="recent">Recent IDs</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="view-mode-toggle" role="group" aria-label="Result layout view">
                <button
                  type="button"
                  className={`view-btn ${viewMode === "cards" ? "is-active" : ""}`}
                  onClick={() => setViewMode("cards")}
                  title="Card View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === "compact" ? "is-active" : ""}`}
                  onClick={() => setViewMode("compact")}
                  title="Compact View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          {filteredIdentities.length === 0 ? (
            <div className="card smart-search-empty-state">
              <div className="empty-icon-circle">
                <Search size={32} />
              </div>
              <h3>No identities matched your search criteria</h3>
              <p>
                No profiles scored at or above {minSimilarity}% similarity with current filters.
                Try adjusting the minimum similarity slider or clearing demographic constraints.
              </p>
              <button className="btn btn-secondary" onClick={handleResetFilters} type="button">
                <RotateCcw size={15} />
                <span>Reset search filters</span>
              </button>
            </div>
          ) : viewMode === "cards" ? (
            <div className="smart-cards-list">
              {filteredIdentities.map((item) => (
                <article
                  key={item.id}
                  className="card smart-identity-card"
                  onClick={() => setSelectedIdentity(item)}
                >
                  <div className="card-top-row">
                    <div className="identity-avatar-wrap">
                      <div className="identity-avatar">
                        {item.latin
                          .split(" ")
                          .map((p) => p[0])
                          .join("")}
                      </div>
                    </div>

                    <div className="identity-primary-info">
                      <div className="name-and-status">
                        <span className="identity-khmer-name">{item.khmer}</span>
                        <span className="identity-latin-name">{item.latin}</span>
                        <span className="identity-kid-tag">{item.id}</span>
                        <span
                          className={`identity-status-pill ${
                            item.status === "Verified" ? "verified" : "review"
                          }`}
                        >
                          <span className="status-dot" />
                          {item.status}
                        </span>
                      </div>

                      <p className="identity-match-detail">{item.detail}</p>
                    </div>

                    {/* Similarity Score Pillar */}
                    <div className="identity-score-column">
                      <div
                        className={`score-pill ${
                          item.score >= 90 ? "high" : item.score >= 80 ? "medium" : "low"
                        }`}
                      >
                        <span className="score-num">{item.score}%</span>
                        <span className="score-subtext">{item.matchType}</span>
                      </div>
                      <ChevronRight size={18} className="card-arrow" />
                    </div>
                  </div>

                  {/* Metadata Demographics Grid */}
                  <div className="identity-demographics-row">
                    <div className="demographic-item">
                      <Calendar size={13} />
                      <span>{item.dob} ({item.age}y)</span>
                    </div>
                    <div className="demographic-item">
                      <UserRound size={13} />
                      <span>{item.gender}</span>
                    </div>
                    <div className="demographic-item">
                      <FileText size={13} />
                      <span>{item.docType}: <b>{item.docNumber}</b></span>
                    </div>
                    <div className="demographic-item">
                      <MapPin size={13} />
                      <span>{item.province}</span>
                    </div>
                    <div className="demographic-item">
                      <Phone size={13} />
                      <span>{item.phone}</span>
                    </div>
                  </div>

                  {/* Similarity Breakdown Signals */}
                  <div className="identity-signals-row">
                    <span className="signal-badge">
                      <Check size={12} /> Khmer Script: {item.signals.orthographic}%
                    </span>
                    <span className="signal-badge">
                      <Check size={12} /> Phonetic Equivalence: {item.signals.phonetic}%
                    </span>
                    <span className="signal-badge">
                      <Check size={12} /> Romanisation: {item.signals.latin}%
                    </span>
                    <span className="signal-badge demographic">
                      <ShieldCheck size={12} /> {item.signals.demographic}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Compact Rows View */
            <div className="card smart-compact-table-wrap">
              <table className="smart-compact-table">
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Khmer Name</th>
                    <th>Latin Name</th>
                    <th>Gender</th>
                    <th>DOB</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Similarity</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredIdentities.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedIdentity(item)}
                      className="compact-row"
                    >
                      <td>
                        <span className="compact-kid">{item.id}</span>
                      </td>
                      <td>
                        <strong className="compact-khmer">{item.khmer}</strong>
                      </td>
                      <td>
                        <span className="compact-latin">{item.latin}</span>
                      </td>
                      <td>{item.gender}</td>
                      <td>{item.dob}</td>
                      <td>{item.province}</td>
                      <td>
                        <span
                          className={`identity-status-pill ${
                            item.status === "Verified" ? "verified" : "review"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`compact-score ${
                            item.score >= 90 ? "high" : item.score >= 80 ? "medium" : "low"
                          }`}
                        >
                          {item.score}%
                        </span>
                      </td>
                      <td>
                        <ChevronRight size={16} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Identity Inspection Modal */}
      {selectedIdentity && (
        <div className="modal-backdrop" onClick={() => setSelectedIdentity(null)}>
          <div
            className="card smart-inspection-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="inspection-modal-header">
              <div className="modal-title-wrap">
                <span className="modal-kid-badge">{selectedIdentity.id}</span>
                <h3>Identity Record Details</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedIdentity(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="inspection-modal-body">
              {/* Profile Card Summary */}
              <div className="modal-profile-summary">
                <div className="modal-avatar">
                  {selectedIdentity.latin
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="modal-khmer-name">{selectedIdentity.khmer}</h4>
                  <div className="modal-latin-row">
                    <span className="modal-latin-name">{selectedIdentity.latin}</span>
                    <span className="modal-status-badge">{selectedIdentity.status}</span>
                  </div>
                </div>

                <div className="modal-score-badge">
                  <strong>{selectedIdentity.score}%</strong>
                  <span>{selectedIdentity.matchType}</span>
                </div>
              </div>

              {/* Signals Breakdown */}
              <div className="modal-signals-box">
                <div className="signals-box-header">
                  <Sparkles size={15} />
                  <span>Cross-Lingual Match Breakdown</span>
                </div>
                <div className="signals-metrics-grid">
                  <div className="metric-cell">
                    <span>Khmer Orthography</span>
                    <strong>{selectedIdentity.signals.orthographic}%</strong>
                  </div>
                  <div className="metric-cell">
                    <span>Phonetic Soundex</span>
                    <strong>{selectedIdentity.signals.phonetic}%</strong>
                  </div>
                  <div className="metric-cell">
                    <span>Latin Romanisation</span>
                    <strong>{selectedIdentity.signals.latin}%</strong>
                  </div>
                  <div className="metric-cell">
                    <span>Demographic Match</span>
                    <strong className="text-demographic">Confirmed</strong>
                  </div>
                </div>
              </div>

              {/* Demographics Field Grid */}
              <div className="modal-fields-grid">
                <div className="field-block">
                  <label>Document Type & Number</label>
                  <span>
                    {selectedIdentity.docType} · {selectedIdentity.docNumber}
                  </span>
                </div>
                <div className="field-block">
                  <label>Date of Birth</label>
                  <span>
                    {selectedIdentity.dob} (Age {selectedIdentity.age})
                  </span>
                </div>
                <div className="field-block">
                  <label>Gender</label>
                  <span>{selectedIdentity.gender}</span>
                </div>
                <div className="field-block">
                  <label>Phone Number</label>
                  <span>{selectedIdentity.phone}</span>
                </div>
                <div className="field-block">
                  <label>Province / Municipality</label>
                  <span>{selectedIdentity.province}</span>
                </div>
                <div className="field-block">
                  <label>Match Notes</label>
                  <span>{selectedIdentity.detail}</span>
                </div>
              </div>
            </div>

            <div className="inspection-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedIdentity(null)}
              >
                Close
              </button>
              {onViewRecord && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const rec = {
                      id: selectedIdentity.id,
                      khmer: selectedIdentity.khmer,
                      latin: selectedIdentity.latin,
                      dob: selectedIdentity.dob,
                      gender: selectedIdentity.gender,
                      phone: selectedIdentity.phone,
                      province: selectedIdentity.province,
                      docId: selectedIdentity.docNumber,
                      docType: selectedIdentity.docType,
                      status: selectedIdentity.status,
                      source: "Civil Registry",
                      createdAt: "14 Feb 2024",
                      accuracy: selectedIdentity.score,
                    };
                    setSelectedIdentity(null);
                    onViewRecord(rec);
                  }}
                >
                  <span>Open Full Record Dossier</span>
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
