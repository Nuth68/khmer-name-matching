import React from "react";

export interface ProgressBarProps {
  value: number;
  min?: number;
  max?: number;
  labelPosition?: "right" | "top" | "bottom" | "none";
  color?: "primary" | "blue" | "success" | "warning" | "error";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  min = 0,
  max = 100,
  labelPosition = "right",
  color = "blue",
  className = "",
}) => {
  const percentage = Math.round(
    Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  );

  const fillColors: Record<string, string> = {
    primary: "var(--primary, #2f8f74)",
    blue: "#2563eb",
    success: "#16a34a",
    warning: "#d97706",
    error: "#dc2626",
  };

  return (
    <div className={`nc-progress flex items-center gap-3 w-full ${className}`}>
      <div className="nc-progress-track flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="nc-progress-bar h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: fillColors[color] || fillColors.blue,
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        />
      </div>
      {labelPosition === "right" && (
        <span className="nc-progress-label text-sm font-medium text-slate-700 dark:text-slate-300 tabular-nums min-w-[36px] text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
};

export const ProgressBarTextRight: React.FC<Partial<ProgressBarProps>> = (props) => (
  <ProgressBar labelPosition="right" min={0} max={100} value={40} {...props} />
);

export default ProgressBar;
