import React from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, max = 5, readOnly = false, className }) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const handleClick = (v: number) => {
    if (!readOnly && onChange) onChange(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onChange || readOnly) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(0.5, value - 0.5));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(max, value + 0.5));
    }
  };

  return (
    <div
      className={`flex items-center gap-1 ${readOnly ? "pointer-events-none" : "cursor-pointer"} ${className || ""}`}
      tabIndex={readOnly ? -1 : 0}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={0.5}
      aria-valuemax={max}
      aria-label="Rating"
      onKeyDown={handleKeyDown}
    >
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const displayValue = hoverValue !== null ? hoverValue : value;
        let icon;
        if (displayValue >= starValue) {
          // Full star
          icon = (
            <svg key={starValue} viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" width={28} height={28}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          );
        } else if (displayValue >= starValue - 0.5) {
          // Half star
          icon = (
            <svg key={starValue} viewBox="0 0 24 24" width={28} height={28}>
              <defs>
                <linearGradient id={`half-grad-${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={`url(#half-grad-${i})`} stroke="#fbbf24" />
            </svg>
          );
        } else {
          // Empty star
          icon = (
            <svg key={starValue} viewBox="0 0 24 24" fill="#e5e7eb" stroke="#fbbf24" width={28} height={28}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          );
        }
        return (
          <span
            key={starValue}
            onMouseEnter={() => !readOnly && setHoverValue(starValue)}
            onMouseMove={e => {
              if (!readOnly) {
                const { left, width } = (e.target as HTMLElement).getBoundingClientRect();
                const x = e.clientX - left;
                setHoverValue(x < width / 2 ? starValue - 0.5 : starValue);
              }
            }}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            onClick={() => handleClick(hoverValue !== null ? hoverValue : starValue)}
            style={{ display: "inline-block", lineHeight: 0 }}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            role="presentation"
          >
            {icon}
          </span>
        );
      })}
      <span className="ml-2 text-lg font-semibold text-yellow-500">{value}</span>
    </div>
  );
};

export default StarRating; 