"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

export interface AppPaginationClientProps {
  currentPage: number;                      // 1-based
  totalPages: number;                       // >= 0 (computed by parent)
  pageSize: number;                         // current volume
  onPageChange: (page: number) => void;     // change page
  onPageSizeChange: (size: number) => void; // change volume
  pageSizeOptions?: number[];               // default: [5,10,15,20]
  resetToPage1OnSizeChange?: boolean;       // default: true
  className?: string;
}

export default function AppPaginationClient({
   currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 15, 20],
  resetToPage1OnSizeChange = true,
  className,
}: AppPaginationClientProps) {
  if (!totalPages || totalPages <= 1) {
    // still show volume control even if only 1 page? choose your UX.
    return (
      <div className={className}>
        <div className="flex items-center justify-end">
          <VolumeDropdown
            pageSize={pageSize}
            options={pageSizeOptions}
            onChange={(s) => {
              onPageSizeChange(s);
              if (resetToPage1OnSizeChange) onPageChange(1);
            }}
          />
        </div>
      </div>
    );
  }

  const clamp = (p: number) => Math.min(Math.max(1, p), totalPages);
  const go = (p: number) => onPageChange(clamp(p));

  // pages: 1 … (c-1) c (c+1) … N
  const pages: (number | "le" | "re")[] = [];
  pages.push(1);

  if (currentPage > 3) pages.push("le"); // left ellipsis

  for (let p = currentPage - 1; p <= currentPage + 1; p++) {
    if (p > 1 && p < totalPages) pages.push(p);
  }

  if (currentPage < totalPages - 2) pages.push("re"); // right ellipsis

  if (totalPages > 1) pages.push(totalPages);


  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Pagination>
          <PaginationContent>
            {/* Prev */}
            <PaginationItem>
                <button
                  type="button"
                  onClick={() => go(currentPage - 1)}
                  disabled={currentPage <= 1}
                  aria-disabled={currentPage <= 1}
                  className={`px-3 py-2 font-medium text-black dark:text-white hover:bg-white rounded-lg ${currentPage <= 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <ChevronLeft size={16} className="inline mr-1" /> Previous
                </button>
            </PaginationItem>

            {/* Numbers + ellipses */}
            {pages.map((it, i) =>
              it === "le" || it === "re" ? (
                <PaginationEllipsis key={`${it}-${i}`} />
              ) : (
                <PaginationItem key={it} className="cursor-pointer">
                  <PaginationLink
                    isActive={it === currentPage}
                    aria-current={it === currentPage ? "page" : undefined}
                  >
                    <button type="button" className="text-black dark:text-white cursor-pointer w-full h-full" onClick={() => go(it as number)}>
                      {it}
                    </button>
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            {/* Next */}
            <PaginationItem>
                <button
                  type="button"
                  onClick={() => go(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  aria-disabled={currentPage >= totalPages}
                  className={`px-3 text-black dark:text-white py-2 font-medium hover:bg-white rounded-lg ${currentPage >= totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Next <ChevronRight size={16} className="inline ml-1" />
                </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <VolumeDropdown
          pageSize={pageSize}
          options={pageSizeOptions}
          onChange={(s) => {
            onPageSizeChange(s);
            if (resetToPage1OnSizeChange) onPageChange(1);
          }}
        />
      </div>
    </div>
  );
}

function VolumeDropdown({
  pageSize,
  options,
  onChange,
}: {
  pageSize: number;
  options: number[];
  onChange: (size: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 text-black dark:text-white">
            {pageSize}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt}
              onClick={() => onChange(opt)}
              className={opt === pageSize ? "font-semibold" : ""}
            >
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
