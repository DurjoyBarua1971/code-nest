"use client";

import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { api } from "@/app/lib/api";
import { ActivityLogEntry } from "@/app/lib/types";

export default function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = {
          _sort: "date",
          _order: "desc",
          _page: currentPage,
          _limit: itemsPerPage,
        };
        const response = await api.get("/activityLog", {
          params,
          headers: { Accept: "application/json" },
        });
        setLogs(response.data);
        const totalCount = parseInt(response.headers["x-total-count"], 10);
        setTotalItems(totalCount);
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [currentPage, itemsPerPage]);

  const onPage = (event: DataTablePageEvent) => {
    setCurrentPage(event.page! + 1);
    setItemsPerPage(event.rows);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Activity Log
      </h1>
      <Card className="shadow-xl border border-gray-200 rounded-lg">
        <DataTable
          value={logs}
          paginator
          rows={itemsPerPage}
          first={(currentPage - 1) * itemsPerPage}
          totalRecords={totalItems}
          onPage={onPage}
          emptyMessage="No activity yet"
          stripedRows
          lazy
        >
          <Column field="user" header="User" />
          <Column field="problemName" header="Problem Name" />
          <Column
            field="action"
            header="Action"
            body={(row) => (
              <span
                className={
                  row.action === "created"
                    ? "text-green-600 font-semibold"
                    : row.action === "edited"
                    ? "text-yellow-700 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {row.action.charAt(0).toUpperCase() + row.action.slice(1)}
              </span>
            )}
          />
          <Column
            field="date"
            header="Date"
            body={(row) => new Date(row.date).toLocaleString()}
          />
        </DataTable>
      </Card>
    </div>
  );
}
