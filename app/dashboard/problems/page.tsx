"use client";

import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { api } from "@/app/lib/api";

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
  const [filters, setFilters] = useState<{
    global: {
      value: string | null;
      matchMode: typeof FilterMatchMode.CONTAINS;
    };
  }>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const router = useRouter();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await api.get("/problems");
        setProblems(response.data);
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

    fetchProblems();
  }, []);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setFilters({
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const navigateToEdit = (problem: Problem) => {
    router.push(`/dashboard/create-problem?edit=true&id=${problem.id}`);
  };

  const confirmDeleteProblem = (problem: Problem) => {
    confirmDialog({
      message: `Are you sure you want to delete "${problem.title}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => deleteProblem(problem.id),
      reject: () => {},
    });
  };

  const deleteProblem = async (id: string) => {
    try {
      await api.delete(`/problems/${id}`);
      setProblems(problems.filter((p) => p.id !== id));
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Problem deleted successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete problem",
        life: 3000,
      });
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold px-4">All Problems</h2>
        <div className="flex items-center">
          <div>
            <InputText
              size={15}
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search problems"
            />
          </div>
          <div className="absolute right-5 top-6 bg-white">
            <i className="pi pi-search" />
          </div>
        </div>
      </div>
    );
  };

  const difficultyBodyTemplate = (rowData: Problem) => {
    const severityMap: Record<
      Problem["difficulty"],
      {
        severity: "success" | "warning" | "danger";
        icon: string;
        color: string;
      }
    > = {
      Easy: {
        severity: "success",
        icon: "pi pi-thumbs-up",
        color: "bg-green-100 text-green-800",
      },
      Medium: {
        severity: "warning",
        icon: "pi pi-exclamation-circle",
        color: "bg-yellow-100 text-yellow-800",
      },
      Hard: {
        severity: "danger",
        icon: "pi pi-bolt",
        color: "bg-red-100 text-red-800",
      },
    };

    const difficulty = rowData.difficulty as keyof typeof severityMap;

    return (
      <Tag
        severity={severityMap[difficulty].severity}
        icon={severityMap[difficulty].icon}
        value={difficulty}
        className="w-24"
      />
    );
  };

  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const descriptionBodyTemplate = (rowData: Problem) => {
    return (
      <div className="line-clamp-2">{truncateText(rowData.description)}</div>
    );
  };

  const actionBodyTemplate = (rowData: Problem) => {
    return (
      <div className="">
        <Button
          icon="pi pi-external-link"
          tooltip="View Resource"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => window.open(rowData.resourceLink, "_blank")}
          className="p-button-rounded p-button-info p-button-sm p-button-text"
        />
        <Button
          icon="pi pi-code"
          tooltip="Practice"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => window.open(rowData.practiceLink, "_blank")}
          className="p-button-rounded p-button-success p-button-sm p-button-text"
        />
        <Button
          icon="pi pi-pencil"
          tooltip="Edit Problem"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => navigateToEdit(rowData)}
          className="p-button-rounded p-button-primary p-button-sm p-button-text"
        />
        <Button
          icon="pi pi-trash"
          tooltip="Delete Problem"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => confirmDeleteProblem(rowData)}
          className="p-button-rounded p-button-danger p-button-sm p-button-text"
        />
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Problem) => {
    return (
      <div className="text-center">
        {new Date(rowData.createdAt).toLocaleDateString()}
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toast ref={toast} position="bottom-right" />
      <ConfirmDialog />
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
        <DataTable
          value={problems}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          dataKey="id"
          filters={filters}
          filterDisplay="menu"
          loading={loading}
          globalFilterFields={["title", "description", "difficulty"]}
          header={header}
          emptyMessage="No problems found"
          stripedRows
          showGridlines
          size="small"
          style={{ width: "100%" }}
          className="bg-gray-100"
        >
          <Column
            align={"center"}
            alignHeader={"center"}
            field="title"
            header="Title"
            sortable
            style={{ width: "20%" }}
            className="font-medium"
            showClearButton
          />
          <Column
            align={"center"}
            alignHeader={"center"}
            field="description"
            header="Description"
            body={descriptionBodyTemplate}
            style={{ width: "35%" }}
          />
          <Column
            align={"center"}
            alignHeader={"center"}
            field="difficulty"
            header="Difficulty"
            body={difficultyBodyTemplate}
            sortable
          />
          <Column
            align={"center"}
            alignHeader={"center"}
            field="createdAt"
            header="Created"
            body={dateBodyTemplate}
            sortable
          />
          <Column
            align={"center"}
            alignHeader={"center"}
            body={actionBodyTemplate}
            header="Actions"
          />
        </DataTable>
      </Card>

      <div className="mt-8 text-center text-gray-500">
        <p>Total Problems: {problems.length}</p>
      </div>
    </div>
  );
}