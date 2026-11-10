'use client';

import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate page numbers to display
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      pages.push(i);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-[#f0ede6] text-sm">
      <div className="text-xs text-stone-500 font-medium">
        Showing <span className="font-bold text-stone-900">{start}</span> to{' '}
        <span className="font-bold text-stone-900">{end}</span> of{' '}
        <span className="font-bold text-stone-900">{total}</span> opportunities
      </div>

      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
        >
          ← Previous
        </button>

        {pages.map((p, idx) => {
          const prevP = pages[idx - 1];
          const hasGap = prevP && p - prevP > 1;

          return (
            <React.Fragment key={p}>
              {hasGap && <span className="px-1 text-stone-400">...</span>}
              <button
                onClick={() => onPageChange(p)}
                className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  page === p
                    ? 'bg-[#ea4e1b] text-white shadow-sm'
                    : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                {p}
              </button>
            </React.Fragment>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
