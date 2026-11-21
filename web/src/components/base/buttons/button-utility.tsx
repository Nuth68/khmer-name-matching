import React, { forwardRef, useState } from "react";
import type { ComponentType, ReactNode, ButtonHTMLAttributes } from "react";
import { Copy01, DownloadCloud02, Edit01, Trash01 } from "@untitledui/icons";

export type ButtonUtilitySize = "xs" | "sm" | "md" | "lg";
export type ButtonUtilityColor =
  | "tertiary"
  | "secondary"
  | "secondary_gray"
  | "primary"
  | "gray"
  | "error";

export interface ButtonUtilityProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  icon?: ComponentType<{ size?: number; className?: string; strokeWidth?: number }> | ReactNode;
  size?: ButtonUtilitySize;
  color?: ButtonUtilityColor;
  tooltip?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const sizeClasses: Record<ButtonUtilitySize, string> = {
  xs: "w-7 h-7 rounded-md p-1",
  sm: "w-8 h-8 rounded-lg p-1.5",
  md: "w-9 h-9 rounded-lg p-2",
  lg: "w-10 h-10 rounded-xl p-2.5",
};

const iconSizes: Record<ButtonUtilitySize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
};

const colorClasses: Record<ButtonUtilityColor, string> = {
  tertiary:
    "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 active:bg-slate-200/80 dark:active:bg-slate-700/80",
  secondary:
    "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs active:bg-slate-100 dark:active:bg-slate-800/80",
  secondary_gray:
    "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs active:bg-slate-100 dark:active:bg-slate-800/80",
  primary:
    "bg-[var(--primary,#2f8f74)] hover:opacity-90 text-white shadow-xs active:opacity-100",
  gray:
    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 active:bg-slate-300 dark:active:bg-slate-600",
  error:
    "text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 active:bg-red-100 dark:active:bg-red-950/60",
};

const tooltipPlacementClasses: Record<"top" | "bottom" | "left" | "right", string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

export const ButtonUtility = forwardRef<HTMLButtonElement, ButtonUtilityProps>(
  (
    {
      icon: Icon,
      size = "sm",
      color = "tertiary",
      tooltip,
      tooltipPlacement = "top",
      className = "",
      disabled = false,
      type = "button",
      children,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const showTooltip = Boolean(tooltip && (isHovered || isFocused));
    const iconSize = iconSizes[size] || 16;

    const renderIcon = () => {
      if (!Icon) return children ?? null;
      if (React.isValidElement(Icon)) return Icon;
      const IconComponent = Icon as ComponentType<{
        size?: number;
        className?: string;
        strokeWidth?: number;
      }>;
      return <IconComponent size={iconSize} strokeWidth={2} aria-hidden="true" />;
    };

    return (
      <div className="btn-utility-wrapper relative inline-flex items-center justify-center">
        <button
          ref={ref}
          type={type}
          disabled={disabled}
          aria-label={tooltip || undefined}
          className={`btn-utility btn-utility--${size} btn-utility--${color} relative inline-flex items-center justify-center font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary,#2f8f74)] focus-visible:ring-offset-2 active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 ${sizeClasses[size] || sizeClasses.sm} ${colorClasses[color] || colorClasses.tertiary} ${className}`}
          onMouseEnter={(e) => {
            setIsHovered(true);
            onMouseEnter?.(e);
          }}
          onMouseLeave={(e) => {
            setIsHovered(false);
            onMouseLeave?.(e);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        >
          {renderIcon()}
        </button>

        {showTooltip && (
          <div
            role="tooltip"
            className={`btn-utility-tooltip btn-utility-tooltip--${tooltipPlacement} absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 text-[11px] font-medium leading-none text-white bg-slate-900/95 dark:bg-slate-800/95 border border-slate-800/80 dark:border-slate-700/80 rounded-md shadow-md backdrop-blur-xs transition-opacity ${tooltipPlacementClasses[tooltipPlacement] || tooltipPlacementClasses.top}`}
          >
            {tooltip}
          </div>
        )}
      </div>
    );
  },
);

ButtonUtility.displayName = "ButtonUtility";

export const UtilityButtonDefaultDemo = () => {
  return (
    <div className="flex items-start gap-1 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/60 dark:border-slate-800/60 w-fit">
      <ButtonUtility size="sm" color="tertiary" tooltip="Copy" icon={Copy01} />
      <ButtonUtility size="sm" color="tertiary" tooltip="Download" icon={DownloadCloud02} />
      <ButtonUtility size="sm" color="tertiary" tooltip="Delete" icon={Trash01} />
      <ButtonUtility size="sm" color="tertiary" tooltip="Edit" icon={Edit01} />
    </div>
  );
};

export default ButtonUtility;
