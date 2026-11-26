import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  Calendar1,
  CalendarDays,
  CalendarRange,
  Calendars,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleGauge,
  Database,
  Filter,
  Fingerprint,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Navigate = (page: string) => void;

const activityData = [
  { day: "Mon", requests: 100 },
  { day: "Tue", requests: 172 },
  { day: "Wed", requests: 136 },
  { day: "Thu", requests: 250 },
  { day: "Fri", requests: 201 },
  { day: "Sat", requests: 300 },
  { day: "Sun", requests: 262 },
];

const overviewStats = [
  {
    label: "Total records",
    value: "12,580",
    change: "+320 this month",
    tone: "blue",
    direction: "up",
    icon: Database,
    trend: [26, 29, 28, 34, 37, 41, 45],
  },
  {
    label: "Potential duplicates",
    value: "342",
    change: "−24 this month",
    tone: "orange",
    direction: "down",
    icon: Fingerprint,
    trend: [50, 47, 49, 43, 40, 38, 35],
  },
  {
    label: "Verified identities",
    value: "10,845",
    change: "+128 this month",
    tone: "green",
    direction: "up",
    icon: ShieldCheck,
    trend: [20, 23, 22, 27, 30, 34, 39],
  },
  {
    label: "Data quality score",
    value: "96.4%",
    change: "+2.1 percentage points",
    tone: "green",
    direction: "up",
    icon: CircleGauge,
    trend: [70, 72, 75, 74, 78, 82, 86],
  },
];

const periodModes = [
  { id: "day", label: "Day", icon: Calendar1 },
  { id: "month", label: "Month", icon: CalendarDays },
  { id: "year", label: "Year", icon: Calendars },
  { id: "range", label: "Date range", icon: CalendarRange },
] as const;

type PeriodMode = (typeof periodModes)[number]["id"];
type DateSelection = { start: Date; end: Date | null };

function createInitialSelection(): DateSelection {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return { start, end };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatPeriodLabel(mode: PeriodMode, selection: DateSelection) {
  const end = selection.end ?? selection.start;
  if (mode === "day") return formatDate(selection.start);
  if (mode === "month") {
    return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
      selection.start,
    );
  }
  if (mode === "year") return String(selection.start.getFullYear());
  return `${new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
    selection.start,
  )} – ${formatDate(end)}`;
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function DashboardHeader({ navigate }: { navigate: Navigate }) {
  const [periodOpen, setPeriodOpen] = useState(false);
  const [modeListOpen, setModeListOpen] = useState(false);
  const [appliedMode, setAppliedMode] = useState<PeriodMode>("range");
  const [draftMode, setDraftMode] = useState<PeriodMode>("range");
  const [appliedSelection, setAppliedSelection] = useState<DateSelection>(createInitialSelection);
  const [draftSelection, setDraftSelection] = useState<DateSelection>(createInitialSelection);
  const [selectingRangeEnd, setSelectingRangeEnd] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const periodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closePeriodMenu = (event: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(event.target as Node)) {
        setPeriodOpen(false);
        setModeListOpen(false);
      }
    };
    const closePeriodMenuWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPeriodOpen(false);
        setModeListOpen(false);
      }
    };
    document.addEventListener("mousedown", closePeriodMenu);
    document.addEventListener("keydown", closePeriodMenuWithEscape);
    return () => {
      document.removeEventListener("mousedown", closePeriodMenu);
      document.removeEventListener("keydown", closePeriodMenuWithEscape);
    };
  }, []);

  const firstDayOffset = (viewMonth.getDay() + 6) % 7;
  const calendarStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1 - firstDayOffset);
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });
  const monthNames = Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat("en", { month: "short" }).format(
      new Date(viewMonth.getFullYear(), month, 1),
    ),
  );
  const yearPageStart = Math.floor(viewMonth.getFullYear() / 12) * 12;
  const visibleYears = Array.from({ length: 12 }, (_, index) => yearPageStart + index);
  const viewTitle =
    draftMode === "year"
      ? `${yearPageStart} – ${yearPageStart + 11}`
      : draftMode === "month"
        ? String(viewMonth.getFullYear())
        : new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(viewMonth);
  const selectedMode = periodModes.find((mode) => mode.id === draftMode)!;

  const changeView = (direction: -1 | 1) => {
    const step = draftMode === "year" ? 144 : draftMode === "month" ? 12 : 1;
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + direction * step, 1));
  };

  const changeMode = (mode: PeriodMode) => {
    const focusDate = draftSelection.end ?? draftSelection.start;
    setDraftMode(mode);
    setSelectingRangeEnd(false);

    if (mode === "day") {
      setDraftSelection({ start: new Date(focusDate), end: new Date(focusDate) });
    } else if (mode === "month") {
      setDraftSelection({
        start: new Date(focusDate.getFullYear(), focusDate.getMonth(), 1),
        end: new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, 0),
      });
    } else if (mode === "year") {
      setDraftSelection({
        start: new Date(focusDate.getFullYear(), 0, 1),
        end: new Date(focusDate.getFullYear(), 11, 31),
      });
    }
  };

  const selectDay = (date: Date) => {
    const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (draftMode === "day") {
      setDraftSelection({ start: selected, end: selected });
      return;
    }

    if (!selectingRangeEnd) {
      setDraftSelection({ start: selected, end: null });
      setSelectingRangeEnd(true);
      return;
    }

    if (selected.getTime() < draftSelection.start.getTime()) {
      setDraftSelection({ start: selected, end: null });
      return;
    }

    setDraftSelection({ start: draftSelection.start, end: selected });
    setSelectingRangeEnd(false);
  };

  const openPicker = () => {
    setPeriodOpen((open) => {
      if (!open) {
        const focusDate = appliedSelection.end ?? appliedSelection.start;
        setDraftMode(appliedMode);
        setDraftSelection({
          start: new Date(appliedSelection.start),
          end: appliedSelection.end ? new Date(appliedSelection.end) : null,
        });
        setViewMonth(new Date(focusDate.getFullYear(), focusDate.getMonth(), 1));
        setSelectingRangeEnd(false);
        setModeListOpen(false);
      }
      return !open;
    });
  };

  return (
    <header className="simple-dashboard-header">
      <div>
        <h1>Dashboard</h1>
      </div>
      <div className="simple-dashboard-actions">
        <div className="simple-date-picker" ref={periodRef}>
          <button
            className={`simple-period-button ${periodOpen ? "is-open" : ""}`}
            type="button"
            onClick={openPicker}
            aria-haspopup="dialog"
            aria-expanded={periodOpen}
            aria-label={`Choose report period. Current selection: ${formatPeriodLabel(appliedMode, appliedSelection)}`}
          >
            <CalendarDays className="simple-period-icon" size={16} />
            <span>{formatPeriodLabel(appliedMode, appliedSelection)}</span>
            <ChevronDown className="simple-period-chevron" size={15} />
          </button>
          {periodOpen && (
            <div className="simple-calendar" role="dialog" aria-label="Choose report period">
              <div className="simple-calendar-header">
                <div className="simple-calendar-header-left">
                  <div className="simple-calendar-filter">
                    <button
                      type="button"
                      className={`simple-calendar-filter-trigger ${modeListOpen ? "is-open" : ""}`}
                      onClick={() => setModeListOpen((open) => !open)}
                      aria-haspopup="listbox"
                      aria-expanded={modeListOpen}
                      title={`Filter: ${selectedMode.label}`}
                      aria-label={`Filter by period type: ${selectedMode.label}`}
                    >
                      <Filter size={15} strokeWidth={2} aria-hidden="true" />
                    </button>
                    {modeListOpen && (
                      <div
                        className="simple-calendar-mode-list"
                        role="listbox"
                        aria-label="Period type"
                      >
                        {periodModes.map((mode) => {
                          const ModeIcon = mode.icon;
                          return (
                            <button
                              type="button"
                              role="option"
                              aria-selected={draftMode === mode.id}
                              className={draftMode === mode.id ? "is-active" : ""}
                              key={mode.id}
                              onClick={() => {
                                changeMode(mode.id);
                                setModeListOpen(false);
                              }}
                            >
                              <span>
                                <ModeIcon size={15} strokeWidth={2} aria-hidden="true" />
                                <span>{mode.label}</span>
                              </span>
                              {draftMode === mode.id && (
                                <Check
                                  className="simple-calendar-mode-check"
                                  size={15}
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <strong>{viewTitle}</strong>
                </div>
                <div className="simple-calendar-header-nav">
                  <button type="button" onClick={() => changeView(-1)} aria-label="Previous period">
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" onClick={() => changeView(1)} aria-label="Next period">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {(draftMode === "day" || draftMode === "range") && (
                <>
                  <div className="simple-calendar-weekdays" aria-hidden="true">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  <div className="simple-calendar-days">
                    {calendarDays.map((date) => {
                      const currentMonth = date.getMonth() === viewMonth.getMonth();
                      const rangeEnd = draftSelection.end ?? draftSelection.start;
                      const value = date.getTime();
                      const inRange =
                        value >= draftSelection.start.getTime() && value <= rangeEnd.getTime();
                      const isStart = isSameDay(date, draftSelection.start);
                      const isEnd = draftSelection.end
                        ? isSameDay(date, draftSelection.end)
                        : false;
                      return (
                        <button
                          type="button"
                          key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                          className={`${currentMonth ? "" : "is-outside"} ${inRange ? "is-in-range" : ""} ${isStart ? "is-range-start" : ""} ${isEnd ? "is-range-end" : ""}`}
                          onClick={() => selectDay(date)}
                          aria-label={formatDate(date)}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {draftMode === "month" && (
                <div className="simple-calendar-months">
                  {monthNames.map((month, index) => {
                    const isSelected =
                      draftSelection.start.getFullYear() === viewMonth.getFullYear() &&
                      draftSelection.start.getMonth() === index;
                    return (
                      <button
                        type="button"
                        key={month}
                        className={isSelected ? "is-selected" : ""}
                        onClick={() => {
                          const start = new Date(viewMonth.getFullYear(), index, 1);
                          const end = new Date(viewMonth.getFullYear(), index + 1, 0);
                          setDraftSelection({ start, end });
                        }}
                      >
                        {month}
                      </button>
                    );
                  })}
                </div>
              )}

              {draftMode === "year" && (
                <div className="simple-calendar-years">
                  {visibleYears.map((year) => {
                    const isSelected = draftSelection.start.getFullYear() === year;
                    return (
                      <button
                        type="button"
                        key={year}
                        className={isSelected ? "is-selected" : ""}
                        onClick={() =>
                          setDraftSelection({
                            start: new Date(year, 0, 1),
                            end: new Date(year, 11, 31),
                          })
                        }
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="simple-calendar-actions">
                <button type="button" onClick={() => setPeriodOpen(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="is-primary"
                  disabled={!draftSelection.end}
                  onClick={() => {
                    if (!draftSelection.end) return;
                    setAppliedMode(draftMode);
                    setAppliedSelection({
                      start: new Date(draftSelection.start),
                      end: new Date(draftSelection.end),
                    });
                    setPeriodOpen(false);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function OverviewCards() {
  return (
    <section className="simple-stat-grid" aria-label="Identity overview">
      {overviewStats.map((stat) => (
        <article className="simple-stat-card" key={stat.label}>
          <div className="simple-stat-label">
            <span>{stat.label}</span>
            <span className={`simple-stat-icon is-${stat.tone}`} aria-hidden="true">
              <stat.icon size={23} strokeWidth={2} />
            </span>
          </div>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </section>
  );
}

function DashboardPanel({
  icon: Icon,
  title,
  subtitle,
  action,
  className = "",
  children,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`simple-panel simple-component-panel ${className}`}>
      <div className="simple-component-heading">
        <div className="simple-component-title">
          {Icon && (
            <span aria-hidden="true">
              <Icon size={18} />
            </span>
          )}
          <div>
            <h2>{title}</h2>
            {subtitle && <small>{subtitle}</small>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MatchingActivity() {
  return (
    <DashboardPanel title="Matching activity" className="simple-activity-panel">
      <div className="simple-activity-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activityData} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="simpleDashboardFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 5" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              domain={[0, 320]}
              ticks={[0, 100, 200, 300]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
            />
            <Tooltip
              cursor={{ stroke: "var(--primary)", strokeDasharray: "3 3", strokeOpacity: 0.4 }}
              contentStyle={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                background: "var(--surface)",
                color: "var(--text)",
                fontSize: 12,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.1)",
              }}
            />
            <Area
              type="linear"
              dataKey="requests"
              stroke="var(--primary)"
              fill="url(#simpleDashboardFill)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, fill: "var(--primary)" }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardPanel>
  );
}

const scriptMatchData = [
  { name: "Khmer vs Latin", value: 45, color: "#2f8f74" },
  { name: "Khmer vs Khmer", value: 30, color: "#6366f1" },
  { name: "Latin vs Latin", value: 25, color: "#0ea5e9" },
];

const renderActiveDonutSector = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 1}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="var(--surface)"
        strokeWidth={2}
      />
    </g>
  );
};

const CustomDonutTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="simple-donut-tooltip">
        <div className="simple-donut-tooltip-header">
          <span className="simple-donut-tooltip-dot" style={{ background: data.payload.color }} />
          <span className="simple-donut-tooltip-title">{data.name}</span>
        </div>
        <div className="simple-donut-tooltip-stat">
          <strong>{data.value}%</strong>
          <span>matches</span>
        </div>
      </div>
    );
  }
  return null;
};

function ScriptMatchingDistribution() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  return (
    <DashboardPanel title="Script distribution" className="simple-script-panel">
      <div className="simple-donut-wrapper">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={scriptMatchData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius={52}
              outerRadius={86}
              stroke="var(--surface)"
              strokeWidth={3}
              isAnimationActive={true}
              animationBegin={100}
              animationDuration={900}
              animationEasing="ease-out"
              activeShape={renderActiveDonutSector}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {scriptMatchData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomDonutTooltip />} />
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="simple-donut-center-val"
            >
              {activeIndex !== undefined ? `${scriptMatchData[activeIndex].value}%` : "100%"}
            </text>
            <text
              x="50%"
              y="59%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="simple-donut-center-label"
            >
              {activeIndex !== undefined
                ? scriptMatchData[activeIndex].name.split(" ")[0]
                : "Total"}
            </text>
          </PieChart>
        </ResponsiveContainer>
        <div className="simple-donut-legend">
          {scriptMatchData.map((item, index) => (
            <button
              type="button"
              key={item.name}
              className={`simple-donut-legend-item ${activeIndex === index ? "is-active" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <i style={{ background: item.color }} />
              <span>{item.name}</span>
              <span className="simple-donut-legend-val">{item.value}%</span>
            </button>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}

export default function CompleteDashboard({ navigate }: { navigate: Navigate }) {
  return (
    <div className="simple-dashboard">
      <DashboardHeader navigate={navigate} />
      <OverviewCards />
      <div className="simple-dashboard-insights">
        <MatchingActivity />
        <ScriptMatchingDistribution />
      </div>
    </div>
  );
}
