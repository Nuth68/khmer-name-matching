import { useMemo, useState } from "react";
import {
  Activity, AlertCircle, ArrowLeftRight, ArrowRight, Bell, BookOpen, Braces,
CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
CircleGauge, ClipboardCheck, Code2, Copy, Database, Download, Eye,
FileClock, FileSearch, FileSpreadsheet, FileText, Filter, Fingerprint,
History, Info, KeyRound, Keyboard, Languages, LayoutDashboard, Menu,
Merge, Moon, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Plus,
RefreshCw, ScanLine, Search, Settings, ShieldCheck, SlidersHorizontal,
Sparkles, Sun, Trash2, UploadCloud, UserRound, UserPlus, Users, X, Zap
} from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import MetricCard from "../../components/common/MetricCard";
import SearchInput from "../../components/common/SearchInput";
import { records } from "../../data/mockData";

export default function Duplicates({ navigate }: { navigate: (s: string) => void }) {
  const [filter, setFilter] = useState("");
  const columns = useMemo<ColumnDef<(typeof records)[number]>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Case ID",
        cell: (info) => <span className="mono">{info.getValue() as string}</span>,
      },
      {
        id: "names",
        header: "Potential match",
        cell: ({ row }) => (
          <div className="name-pair">
            <strong className="khmer">{row.original.a}</strong>
            <span>{row.original.b}</span>
          </div>
        ),
      },
      { accessorKey: "detail", header: "Matching signals" },
      {
        accessorKey: "score",
        header: "Similarity",
        cell: (info) => (
          <div className="table-score">
            <i style={{ width: `${info.getValue()}%` }} />
            <strong>{info.getValue() as number}%</strong>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <Badge
            tone={
              info.getValue() === "Resolved"
                ? "success"
                : info.getValue() === "In review"
                  ? "blue"
                  : "warning"
            }
          >
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        id: "action",
        header: "",
        cell: () => (
          <Button variant="secondary" onClick={() => navigate("Review & Merge")}>
            Compare
          </Button>
        ),
      },
    ],
    [navigate],
  );
  const table = useReactTable({
    data: records,
    columns,
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <>
      <PageHeader
        title="Duplicate Detection"
        description="Find and review records that may belong to the same person."
      >
        <Button variant="secondary">
          <FileText size={16} /> Export results
        </Button>
        <Button>
          <Zap size={16} /> Run new scan
        </Button>
      </PageHeader>
      <div className="metric-grid compact">
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
      <section className="card table-card">
        <div className="table-toolbar">
          <SearchInput
            value={filter}
            onChange={setFilter}
            placeholder="Search by name or case ID…"
          />
          <div>
            <button className="filter-button">
              Score: All <ChevronDown size={14} />
            </button>
            <button className="filter-button">
              Status: Open <ChevronDown size={14} />
            </button>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((h) => (
                    <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-pagination">
          <span>Showing 1–5 of 1,284 results</span>
          <div>
            <button disabled>
              <ChevronLeft size={15} />
            </button>
            <button className="active-page">1</button>
            <button>2</button>
            <button>3</button>
            <button>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

