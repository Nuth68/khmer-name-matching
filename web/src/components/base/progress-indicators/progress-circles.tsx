import type { CSSProperties } from "react";

export type ProgressBarHalfCircleSize = "xxs" | "xs" | "sm" | "md" | "lg";

export interface ProgressBarHalfCircleProps {
  size?: ProgressBarHalfCircleSize;
  min?: number;
  max?: number;
  value: number;
  label?: string;
  className?: string;
}

const WIDTH_BY_SIZE: Record<ProgressBarHalfCircleSize, number> = {
  xxs: 88,
  xs: 116,
  sm: 150,
  md: 184,
  lg: 224,
};

export function ProgressBarHalfCircle({
  size = "sm",
  min = 0,
  max = 100,
  value,
  label = "Similarity score",
  className = "",
}: ProgressBarHalfCircleProps) {
  const safeRange = max - min || 1;
  const percentage = Math.round(
    Math.min(100, Math.max(0, ((value - min) / safeRange) * 100)),
  );
  const style = {
    "--progress-half-width": `${WIDTH_BY_SIZE[size]}px`,
  } as CSSProperties;

  return (
    <div
      className={`progress-half-circle progress-half-circle--${size} ${className}`.trim()}
      style={style}
      role="progressbar"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <svg viewBox="0 0 120 68" aria-hidden="true">
        <path
          className="progress-half-circle__track"
          d="M 10 60 A 50 50 0 0 1 110 60"
          pathLength="100"
        />
        <path
          className="progress-half-circle__fill"
          d="M 10 60 A 50 50 0 0 1 110 60"
          pathLength="100"
          style={{ strokeDashoffset: 100 - percentage }}
        />
      </svg>
      <div className="progress-half-circle__label">
        <strong className="progress-half-circle__value">{percentage}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default ProgressBarHalfCircle;
