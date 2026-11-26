import { useMemo, useState } from "react";
import { ArrowRight, Braces, Download, Filter, MoreHorizontal, Plus } from "lucide-react";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import { groups } from "../../data/mockData";

const operationalConfigs: Record<
  string,
  { description: string; action: string; columns: string[]; rows: string[][] }
> = {
  "Identity History": {
    description: "Review every change made to identity profiles",
    action: "Export history",
    columns: ["Timestamp", "Record", "Change", "Performed by", "Source"],
    rows: [
      ["23 May, 10:42", "KID-10482", "Phone number updated", "Chenda Sok", "Manual review"],
      ["23 May, 09:18", "KID-10341", "Records merged", "Dara Vann", "Duplicate review"],
      ["22 May, 16:05", "KID-10298", "Name romanised", "System", "Import"],
    ],
  },
  "Cross-Database Matching": {
    description: "Compare identities across connected data sources",
    action: "New comparison",
    columns: ["Comparison", "Source A", "Source B", "Matches", "Status"],
    rows: [
      ["National registry ↔ CRM", "128,642", "84,120", "76,483", "Completed"],
      ["HR records ↔ Benefits", "12,480", "11,992", "11,304", "Completed"],
      ["Provincial import", "8,201", "128,642", "—", "Configuring"],
    ],
  },
  "Analytics Overview": {
    description: "Monitor matching volume, accuracy and operational performance",
    action: "Create report",
    columns: ["Metric", "Current period", "Previous period", "Change", "Status"],
    rows: [
      ["Names compared", "186,420", "171,882", "+8.5%", "Healthy"],
      ["Duplicates confirmed", "1,284", "1,102", "+16.5%", "Review"],
      ["Average confidence", "92.8%", "91.4%", "+1.4 pts", "Healthy"],
    ],
  },
  Reports: {
    description: "Create and schedule identity intelligence reports",
    action: "New report",
    columns: ["Report", "Schedule", "Last generated", "Owner", "Status"],
    rows: [
      ["Monthly data quality", "Monthly", "01 May 2025", "Chenda Sok", "Active"],
      ["Duplicate review summary", "Weekly", "19 May 2025", "Dara Vann", "Active"],
      ["API usage audit", "Quarterly", "01 Apr 2025", "Sovanna Lim", "Active"],
    ],
  },
  Organizations: {
    description: "Manage organization profiles and workspace configuration",
    action: "Add organization",
    columns: ["Organization", "Workspace ID", "Members", "Records", "Status"],
    rows: [
      ["National Registry", "org_nat_01", "42", "128,642", "Active"],
      ["Phnom Penh Office", "org_pp_02", "18", "48,210", "Active"],
      ["Battambang Office", "org_bt_03", "9", "16,402", "Active"],
    ],
  },
  "Users & Roles": {
    description: "Manage members, roles and access permissions",
    action: "Invite member",
    columns: ["Member", "Email", "Role", "Last active", "Status"],
    rows: [
      ["Chenda Sok", "chenda@registry.gov.kh", "Administrator", "Now", "Active"],
      ["Dara Vann", "dara@registry.gov.kh", "Reviewer", "12 min ago", "Active"],
      ["Sovanna Lim", "sovanna@registry.gov.kh", "Analyst", "Yesterday", "Active"],
    ],
  },
  "Audit Logs": {
    description: "Track security-sensitive activity across the workspace",
    action: "Export logs",
    columns: ["Timestamp", "User", "Action", "Resource", "IP address"],
    rows: [
      ["23 May, 10:42", "Chenda Sok", "Updated record", "KID-10482", "10.20.4.18"],
      ["23 May, 10:38", "Dara Vann", "Viewed API key", "Production server", "10.20.4.22"],
      ["23 May, 09:18", "Dara Vann", "Merged records", "KID-10341", "10.20.4.22"],
    ],
  },
  "Request Logs": {
    description: "Inspect API requests, latency and response status",
    action: "Export logs",
    columns: ["Timestamp", "Endpoint", "Status", "Latency", "Client"],
    rows: [
      ["10:42:18", "POST /v1/names/compare", "200 OK", "84 ms", "Production server"],
      ["10:41:52", "POST /v1/identities/search", "200 OK", "112 ms", "CRM integration"],
      ["10:39:04", "POST /v1/documents/extract", "429 Rate limit", "18 ms", "Import service"],
    ],
  },
  "API Documentation": {
    description: "Browse endpoints, request schemas and integration examples",
    action: "Quick start",
    columns: ["Endpoint", "Method", "Purpose", "Version", "Status"],
    rows: [
      ["/names/compare", "POST", "Compare Khmer and Latin names", "v1", "Active"],
      ["/identities/search", "POST", "Search and rank identities", "v1", "Active"],
      ["/documents/extract", "POST", "Extract identity document fields", "v1", "Active"],
    ],
  },
};

function OperationalPage({ title }: { title: string }) {
  const [search, setSearch] = useState("");
  const config = operationalConfigs[title] ?? {
    description: `Manage ${title.toLowerCase()} across your K-ID workspace`,
    action: "Create new",
    columns: ["Name", "Type", "Last updated", "Owner", "Status"],
    rows: [
      ["National Registry configuration", "Workspace", "Today", "Chenda Sok", "Active"],
      ["Default matching policy", "Configuration", "Yesterday", "Dara Vann", "Active"],
      ["Identity quality rules", "Ruleset", "18 May 2025", "System", "Active"],
    ],
  };

  const filteredRows = useMemo(() => {
    if (!search.trim()) return config.rows;
    return config.rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(search.toLowerCase())),
    );
  }, [config.rows, search]);

  const handleExportCSV = () => {
    const headers = config.columns.join(",");
    const rows = filteredRows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, "_")}_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader title={title} description={config.description}>
        <Button>
          <Plus size={16} /> {config.action}
        </Button>
      </PageHeader>
      <section className="card operational-table">
        <div className="records-toolbar">
          <div className="records-toolbar-left">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={`Search ${title.toLowerCase()}…`}
            />
          </div>
          <div className="records-toolbar-right">
            <button className="btn btn-secondary" type="button">
              <Filter size={15} />
              <span>Filter</span>
            </button>
            <button className="btn btn-secondary" onClick={handleExportCSV} type="button">
              <Download size={15} />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      {cellIndex === row.length - 1 ? (
                        <Badge
                          tone={cell === "Review" || cell === "Configuring" ? "warning" : "success"}
                        >
                          {cell}
                        </Badge>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                  <td>
                    <button className="row-action">
                      <MoreHorizontal size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function GenericPage({ title }: { title: string }) {
  const Icon = groups.flatMap((g) => g.items).find((i) => i.label === title)?.icon ?? Braces;
  return (
    <>
      <PageHeader
        title={title}
        description={`Manage ${title.toLowerCase()} securely across your K-ID workspace.`}
      >
        <Button>
          <Plus size={16} /> Get started
        </Button>
      </PageHeader>
      <section className="card generic-page">
        <div className="generic-icon">
          <Icon size={28} />
        </div>
        <h2>{title}</h2>
        <p>This workspace is ready for your organization’s data and configuration.</p>
        <div className="generic-actions">
          <Button variant="secondary">View documentation</Button>
          <Button>Configure workspace</Button>
        </div>
      </section>
    </>
  );
}

export default OperationalPage;
export { GenericPage };
