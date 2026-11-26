import { ArrowLeftRight } from "lucide-react";
import { IconType } from "../../types";

export interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  icon?: IconType;
  tone?: "blue" | "success" | "warning" | "amber" | "red" | "green";
}

export default function MetricCard({
  label,
  value,
  trend,
  icon: Icon = ArrowLeftRight,
  tone = "blue",
}: MetricCardProps) {
  return (
    <div className={`card metric-card metric-${tone}`}>
      <div className="metric-top">
        <span>{label}</span>
        <div className={`metric-icon ${tone}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-trend">{trend}</div>
    </div>
  );
}
