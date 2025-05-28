"use client";

import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";

import { Problem } from "@/app/lib/types";
import {
  actionBodyTemplate,
  dateBodyTemplate,
  descriptionBodyTemplate,
  difficultyBodyTemplate,
} from "./ProblemTemplates";

interface ProblemTableProps {
  problems: Problem[];
  loading: boolean;
  header: React.ReactNode;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (e: { page: number; rows: number }) => void;
}

export default function ProblemTable({
  problems,
  loading,
  header,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
}: ProblemTableProps) {
  return (
    <div>
      <DataTable
        value={problems}
        dataKey="id"
        loading={loading}
        header={header}
        emptyMessage="No problems found"
        stripedRows
        showGridlines
        size="small"
        style={{ width: "100%" }}
        className="bg-gray-100"
      >
        <Column
          align="center"
          alignHeader="center"
          field="title"
          header="Title"
          sortable
          style={{ width: "20%" }}
          className="font-medium"
          showClearButton
        />
        <Column
          align="center"
          alignHeader="center"
          field="description"
          header="Description"
          body={descriptionBodyTemplate}
          style={{ width: "35%" }}
        />
        <Column
          align="center"
          alignHeader="center"
          field="difficulty"
          header="Difficulty"
          body={difficultyBodyTemplate}
          sortable
        />
        <Column
          align="center"
          alignHeader="center"
          field="createdAt"
          header="Created"
          body={dateBodyTemplate}
          sortable
        />
        <Column
          align="center"
          alignHeader="center"
          body={actionBodyTemplate}
          header="Actions"
        />
      </DataTable>
      <Paginator
        first={(currentPage - 1) * itemsPerPage}
        rows={itemsPerPage}
        totalRecords={totalItems}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        className="mt-4"
      />
    </div>
  );
}
