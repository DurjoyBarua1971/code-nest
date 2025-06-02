"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useDebounce } from "@/app/hooks/useDebounce";
import { Problem, ProblemQueryParams } from "@/app/lib/types";
import ProblemFilter from "@/app/ui/ProblemFilter";
import ProblemTable from "@/app/ui/ProblemTable";

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const debouncedSearchValue = useDebounce(globalFilterValue, 500);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    setSearchValue(debouncedSearchValue);
  }, [debouncedSearchValue]);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        
        const params: ProblemQueryParams = {
          _page: currentPage,
          _limit: itemsPerPage,
        };

        if (searchValue) {
          params.title_like = searchValue;
        }

        if (dateRange?.length === 2 && dateRange[0] && dateRange[1]) {
          const [start, end] = dateRange;
          params.createdAt_gte = start.toISOString();
          params.createdAt_lte = end.toISOString();
        }

        if (difficultyFilter) params.difficulty = difficultyFilter;

        const response = await api.get("/problems", {
          params,
          headers: { Accept: "application/json" },
        });
        
        setProblems(response.data);        

        const totalCount = parseInt(response.headers["x-total-count"], 10);
        setTotalItems(totalCount);

      } catch (error) {
        console.error("Error fetching problems:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load problems",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    if ((dateRange.length === 2 && dateRange[1]) || dateRange.length === 0) {
      fetchProblems();
    }
  }, [currentPage, itemsPerPage, searchValue, difficultyFilter, dateRange]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setGlobalFilterValue(e.target.value);
  
  const onResetFilters = () => {
    setGlobalFilterValue("");
    setSearchValue("");
    setDifficultyFilter("");
    setDateRange([]);
    setShowFilterDropdown(false);
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const handleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilter(difficulty);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold px-4">All Problems</h2>
      <ProblemFilter
        globalFilterValue={globalFilterValue}
        difficultyFilter={difficultyFilter}
        showFilterDropdown={showFilterDropdown}
        onGlobalFilterChange={onGlobalFilterChange}
        onResetFilters={onResetFilters}
        handleDifficultyFilter={handleDifficultyFilter}
        setShowFilterDropdown={setShowFilterDropdown}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
    </div>
  );

  const onPageChange = (e: { page: number; rows: number }) => {
    setCurrentPage(e.page + 1);
    setItemsPerPage(e.rows);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toast ref={toast} position="bottom-right" />
      <div className="mb-8 flex flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3 flex items-center">
            Problem Bank
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Browse, search, and manage all available coding problems
          </p>
        </div>
        <Button
          size="small"
          label="Create New Problem"
          icon="pi pi-plus"
          onClick={() => router.push("/dashboard/create-problem")}
        />
      </div>
      <Card className="shadow-xl border border-gray-200 rounded-lg">
        <ProblemTable
          problems={problems}
          setProblems={setProblems}
          setTotalItems={setTotalItems}
          loading={loading}
          header={renderHeader()}
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      </Card>
      <div className="mt-8 text-center text-gray-500">
        <p>Total Problems: {totalItems}</p>
      </div>
    </div>
  );
}
