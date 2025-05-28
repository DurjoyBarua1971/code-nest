"use client";

import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

interface ProblemFilterProps {
  globalFilterValue: string;
  difficultyFilter: string;
  showFilterDropdown: boolean;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetFilters: () => void;
  handleDifficultyFilter: (difficulty: string) => void;
  setShowFilterDropdown: (show: boolean) => void;
}

export default function ProblemFilter({ globalFilterValue, difficultyFilter, showFilterDropdown, onGlobalFilterChange, onResetFilters, handleDifficultyFilter, setShowFilterDropdown }: ProblemFilterProps) {
  const renderDropdown = () => (
    <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
      <div className="py-1">
        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleDifficultyFilter("Easy")}>Easy</button>
        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleDifficultyFilter("Medium")}>Medium</button>
        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleDifficultyFilter("Hard")}>Hard</button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center space-x-4!">
      <div className="relative">
        <Button
          type="button"
          icon="pi pi-filter"
          label={difficultyFilter ? `Filter: ${difficultyFilter}` : "Filter"}
          outlined
          size="small"
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className={`p-button-secondary ${difficultyFilter ? "p-button-info" : ""}`}
        />
        {showFilterDropdown && renderDropdown()}
      </div>
      <Button
        type="button"
        icon="pi pi-refresh"
        label="Reset"
        outlined
        size="small"
        onClick={onResetFilters}
        className="p-button-warning"
      />
      <div className="relative">
        <InputText
          size={18}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search problems"
          className="pl-8!"
        />
        <i className="pi pi-search absolute left-2 top-1/2 transform -translate-y-1/2!" />
      </div>
    </div>
  );
}