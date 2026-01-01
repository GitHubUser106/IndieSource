"use client";

import { Search, ArrowRight, RotateCw } from "lucide-react";

interface UrlInputFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  buttonLabel?: string;
  value: string;
  onChange: (val: string) => void;
}

export default function UrlInputForm({
  onSubmit,
  isLoading,
  buttonLabel = "Find Alternatives",
  value,
  onChange
}: UrlInputFormProps) {

  return (
    <form onSubmit={onSubmit} className="w-full">
      {/* INPUT + BUTTON - stacked on mobile, inline on md+ */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative w-full md:flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search size={20} />
          </div>

          <input
            type="url"
            placeholder="Paste any news article URL..."
            className="w-full pl-12 pr-4 py-3 lg:py-4 rounded-lg border border-slate-200 focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20 transition-all outline-none text-slate-700 placeholder:text-slate-400 text-base"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
          />
        </div>

        {/* BUTTON - full width on mobile, auto on md+ */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-[color:var(--primary)] hover:opacity-90 text-white py-3 lg:py-4 px-6 lg:px-8 rounded-lg font-medium text-base transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              {/* Icon Logic */}
              {buttonLabel.includes("Regenerate") || buttonLabel.includes("Try") ? (
                <RotateCw size={20} />
              ) : null}

              {/* Label */}
              <span>{buttonLabel}</span>

              {/* Arrow Logic */}
              {!buttonLabel.includes("Regenerate") && !buttonLabel.includes("Try") && (
                <ArrowRight size={20} />
              )}
            </>
          )}
        </button>
      </div>
    </form>
  );
}