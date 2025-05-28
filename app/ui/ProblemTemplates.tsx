"use client";

import React from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { api } from "@/app/lib/api";
import { Problem } from "../lib/types";


export const difficultyBodyTemplate = (rowData: Problem) => {
  const severityMap: Record<Problem["difficulty"], { severity: "success" | "warning" | "danger"; icon: string; color: string }> = {
    Easy: { severity: "success", icon: "pi pi-thumbs-up", color: "bg-green-100 text-green-800" },
    Medium: { severity: "warning", icon: "pi pi-exclamation-circle", color: "bg-yellow-100 text-yellow-800" },
    Hard: { severity: "danger", icon: "pi pi-bolt", color: "bg-red-100 text-red-800" },
  };
  const difficulty = rowData.difficulty as keyof typeof severityMap;
  return <Tag severity={severityMap[difficulty].severity} icon={severityMap[difficulty].icon} value={difficulty} className="w-24" />;
};

export const descriptionBodyTemplate = (rowData: Problem) => {
  const truncateText = (text: string, maxLength = 100) => (text.length <= maxLength ? text : text.substr(0, maxLength) + "...");
  return <div className="line-clamp-2">{truncateText(rowData.description)}</div>;
};

export const actionBodyTemplate = (rowData: Problem) => {
  const router = useRouter();
  const toast = React.useRef<Toast>(null);

  const confirmDeleteProblem = () => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.title}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => deleteProblem(),
      reject: () => {},
    });
  };

  const deleteProblem = async () => {
    try {
      await api.delete(`/problems/${rowData.id}`);
      toast.current?.show({ severity: "success", summary: "Success", detail: "Problem deleted successfully", life: 3000 });
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to delete problem", life: 3000 });
    }
  };

  const navigateToEdit = () => router.push(`/dashboard/create-problem?edit=true&id=${rowData.id}`);

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      <ConfirmDialog />
      <Button icon="pi pi-external-link" tooltip="View Resource" tooltipOptions={{ position: "bottom" }} onClick={() => window.open(rowData.resourceLink, "_blank")} className="p-button-rounded p-button-info p-button-sm p-button-text" />
      <Button icon="pi pi-code" tooltip="Practice" tooltipOptions={{ position: "bottom" }} onClick={() => window.open(rowData.practiceLink, "_blank")} className="p-button-rounded p-button-success p-button-sm p-button-text" />
      <Button icon="pi pi-pencil" tooltip="Edit Problem" tooltipOptions={{ position: "bottom" }} onClick={navigateToEdit} className="p-button-rounded p-button-primary p-button-sm p-button-text" />
      <Button icon="pi pi-trash" tooltip="Delete Problem" tooltipOptions={{ position: "bottom" }} onClick={confirmDeleteProblem} className="p-button-rounded p-button-danger p-button-sm p-button-text" />
    </div>
  );
};

export const dateBodyTemplate = (rowData: Problem) => <div className="text-center">{new Date(rowData.createdAt).toLocaleDateString()}</div>;