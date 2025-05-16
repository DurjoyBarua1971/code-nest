"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { useRouter } from "next/navigation";
import initialProblems from "@/app/data/problems.json";

// Define the problem structure
interface Problem {
  id: string;
  title: string;
  description: string;
  resourceLink: string;
  practiceLink: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: string;
}

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProblems = () => {
      setLoading(true);
      try {
        // Get problems from localStorage if available
        const localProblems = localStorage.getItem("problems");

        if (localProblems) {
          setProblems(JSON.parse(localProblems));
        } else {
          // If no localStorage data, use initial problems from JSON
          setProblems(initialProblems as Problem[]);
          // Save initial problems to localStorage
          localStorage.setItem("problems", JSON.stringify(initialProblems));
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        setProblems(initialProblems as Problem[]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);

    setFilters({
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">All Problems</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search problems"
          />
        </span>
      </div>
    );
  };

  const difficultyBodyTemplate = (rowData: Problem) => {
    const severityMap = {
      Easy: { severity: "success", icon: "pi pi-thumbs-up" },
      Medium: { severity: "warning", icon: "pi pi-exclamation-circle" },
      Hard: { severity: "danger", icon: "pi pi-bolt" },
    };

    const difficulty = rowData.difficulty as keyof typeof severityMap;

    return (
      <Tag
        severity={severityMap[difficulty].severity}
        icon={severityMap[difficulty].icon}
        value={difficulty}
      />
    );
  };

  const actionBodyTemplate = (rowData: Problem) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-external-link"
          tooltip="View Resource"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => window.open(rowData.resourceLink, "_blank")}
          className="p-button-rounded p-button-info p-button-sm"
        />
        <Button
          icon="pi pi-code"
          tooltip="Practice"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => window.open(rowData.practiceLink, "_blank")}
          className="p-button-rounded p-button-success p-button-sm"
        />
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Problem) => {
    return new Date(rowData.createdAt).toLocaleDateString();
  };

  const header = renderHeader();

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Problem Bank</h1>
        <p className="text-gray-600 mb-4">
          Browse, search, and manage all available coding problems
        </p>
        <Button
          label="Create New Problem"
          icon="pi pi-plus"
          className="p-button-raised"
          onClick={() => router.push("/dashboard/create-problem")}
        />
      </div>

      <Card className="shadow-lg">
        <DataTable
          value={problems}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          dataKey="id"
          filters={filters}
          filterDisplay="menu"
          loading={loading}
          responsiveLayout="scroll"
          globalFilterFields={["title", "description", "difficulty"]}
          header={header}
          emptyMessage="No problems found"
        >
          <Column
            field="title"
            header="Title"
            sortable
            style={{ width: "25%" }}
          />
          <Column
            field="description"
            header="Description"
            style={{ width: "35%" }}
          />
          <Column
            field="difficulty"
            header="Difficulty"
            body={difficultyBodyTemplate}
            sortable
            style={{ width: "15%" }}
          />
          <Column
            field="createdAt"
            header="Created"
            body={dateBodyTemplate}
            sortable
            style={{ width: "15%" }}
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            style={{ width: "10%" }}
          />
        </DataTable>
      </Card>
    </div>
  );
}
